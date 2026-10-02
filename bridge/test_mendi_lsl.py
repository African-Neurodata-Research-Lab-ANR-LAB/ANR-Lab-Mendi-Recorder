import asyncio
import json
import math
import unittest

from mendi_lsl import BridgeServer, BridgeSession, ALLOWED_ORIGINS
from websockets.asyncio.client import connect
from websockets.asyncio.server import serve
from websockets.exceptions import InvalidStatus


class RecordingOutlet:
    def __init__(self):
        self.samples = []

    def push_sample(self, sample, timestamp):
        self.samples.append((sample, timestamp))


def start_message():
    return dict(schema_version=1, type="start", run_id="run-1", clock_offset_s=100, clock_rtt_ms=20)


def sample_message():
    return dict(schema_version=1, type="sample", run_id="run-1", sequence=1,
                timestamp_ms=1500, optical=[10, 20, None, None], imu=[1, 2, 3, 4, 5, 6],
                repeated=True, poll=True)


class ProtocolTests(unittest.TestCase):
    def setUp(self):
        self.outlets = {}
        def factory(spec):
            outlet = RecordingOutlet()
            self.outlets[spec["kind"]] = outlet
            return outlet
        self.bridge = BridgeSession(factory, clock=lambda: 105)
        self.bridge.handle(start_message())

    def test_raw_samples_and_quality_share_browser_receipt_time(self):
        self.bridge.handle(sample_message())
        sample, timestamp = self.outlets["optical"].samples[0]
        self.assertEqual(sample[:2], [10, 20])
        self.assertTrue(math.isnan(sample[2]))
        self.assertEqual(timestamp, 101.5)
        self.assertEqual(self.outlets["quality"].samples, [([1, 1, 1], 101.5)])

    def test_event_time_is_original_onset_not_bridge_receipt(self):
        event = dict(onset=0.25, description="TASK_START", source="protocol")
        self.bridge.handle(dict(schema_version=1, type="event", run_id="run-1", sequence=1,
                                timestamp_ms=1250, event=event))
        sample, timestamp = self.outlets["events"].samples[0]
        self.assertEqual(json.loads(sample[0]), event)
        self.assertEqual(timestamp, 101.25)

    def test_rejects_duplicate_sequences_and_missing_optical_data(self):
        self.bridge.handle(sample_message())
        with self.assertRaises(ValueError):
            self.bridge.handle(sample_message())
        for change in [dict(sequence=2, optical=[None]*4), dict(sequence=2, timestamp_ms=float("nan")),
                       dict(sequence=2, optical=[True, 2, 3, 4]), dict(sequence=2, imu=[0]),
                       dict(sequence=2, timestamp_ms=1400), dict(sequence=2, run_id="wrong")]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.bridge.handle(sample_message() | change)
        self.assertEqual(len(self.outlets["optical"].samples), 1)

    def test_missing_imu_does_not_publish_zero_movement(self):
        self.bridge.handle(sample_message() | dict(imu=[None]*6))
        self.assertEqual(self.outlets["imu"].samples, [])

    def test_stop_closes_session_and_rejects_further_samples(self):
        self.bridge.handle(dict(schema_version=1, type="stop", run_id="run-1"))
        with self.assertRaises(ValueError):
            self.bridge.handle(sample_message())


class WebSocketTests(unittest.IsolatedAsyncioTestCase):
    async def test_actual_socket_sync_ingestion_and_single_client_guard(self):
        outlets = {}
        def factory(spec):
            outlets[spec["kind"]] = RecordingOutlet()
            return outlets[spec["kind"]]
        server = BridgeServer(outlet_factory=factory, clock=lambda: 200)
        async with serve(server.handle, "127.0.0.1", 0, origins=ALLOWED_ORIGINS) as listener:
            port = listener.sockets[0].getsockname()[1]
            url = f"ws://127.0.0.1:{port}"
            with self.assertRaises(InvalidStatus):
                async with connect(url, origin="https://example.com", proxy=None):
                    pass
            async with connect(url, origin="http://localhost:5173", proxy=None) as ws:
                await ws.send(json.dumps(dict(schema_version=1, type="sync", client_send_ms=10)))
                reply = json.loads(await ws.recv())
                self.assertEqual(reply, dict(type="sync", client_send_ms=10, server_time_s=200))
                async with connect(url, origin="http://localhost:5173", proxy=None) as other:
                    self.assertEqual(json.loads(await other.recv())["type"], "error")
                await ws.send(json.dumps(start_message()))
                self.assertEqual(json.loads(await ws.recv())["type"], "started")
                await ws.send(json.dumps(sample_message()))
                await ws.send(json.dumps(dict(schema_version=1, type="sync", client_send_ms=20)))
                await ws.recv()  # ordered round trip proves the preceding sample was handled
                self.assertEqual(outlets["optical"].samples[0][1], 101.5)
                await ws.send("[]")
                self.assertEqual(json.loads(await ws.recv())["type"], "error")


if __name__ == "__main__":
    unittest.main()
