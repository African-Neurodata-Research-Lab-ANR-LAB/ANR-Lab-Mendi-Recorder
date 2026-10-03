"""Synthetic loopback check of actual WebSocket and LSL delivery; no headset needed."""
import asyncio
import json

from pylsl import StreamInlet, local_clock, resolve_byprop
from websockets.asyncio.client import connect
from websockets.asyncio.server import serve
from mendi_lsl import BridgeServer, ALLOWED_ORIGINS, lsl_outlet


async def run():
    outlets = {}
    def factory(spec):
        outlet = lsl_outlet(spec)
        outlets[spec["kind"]] = outlet
        return outlet
    server = BridgeServer(outlet_factory=factory)
    async with serve(server.handle, "127.0.0.1", 0, origins=ALLOWED_ORIGINS) as listener:
        port = listener.sockets[0].getsockname()[1]
        async with connect(f"ws://127.0.0.1:{port}", origin="http://localhost:5173", proxy=None) as ws:
            async def send(message):
                await ws.send(json.dumps(dict(schema_version=1, run_id="synthetic-smoke", **message)))
            offset = local_clock() - 2
            await send(dict(type="start", clock_offset_s=offset, clock_rtt_ms=1))
            assert json.loads(await ws.recv())["type"] == "started"
            inlets = {}
            for kind, outlet in outlets.items():
                resolved = await asyncio.to_thread(resolve_byprop, "source_id", outlet.get_info().source_id(), 1, 3)
                assert resolved, f"Could not discover the synthetic {kind} outlet"
                inlets[kind] = StreamInlet(resolved[0], max_buflen=10)
            try:
                for inlet in inlets.values():
                    await asyncio.to_thread(inlet.open_stream, 3)
                await send(dict(type="sample", timestamp_ms=2000, sequence=1, optical=[10,20,30,40],
                                imu=[1,2,3,4,5,6], repeated=True, poll=True))
                await send(dict(type="event", timestamp_ms=1000, sequence=1,
                                event=dict(onset=0, description="SYNTHETIC_TASK_START", source="test")))
                got = {kind: await asyncio.to_thread(inlet.pull_sample, 3) for kind, inlet in inlets.items()}
                assert got["optical"][0] == [10,20,30,40], got
                assert got["imu"][0] == [1,2,3,4,5,6], got
                assert got["quality"][0] == [1,1,1], got
                assert json.loads(got["events"][0][0])["description"] == "SYNTHETIC_TASK_START", got
                assert abs(got["optical"][1] - got["events"][1] - 1) < 1e-6, got
                print("PASS: four real LSL inlets received raw values, quality flags, and the original event timestamp.")
            finally:
                for inlet in inlets.values():
                    inlet.close_stream()


if __name__ == "__main__":
    asyncio.run(run())
