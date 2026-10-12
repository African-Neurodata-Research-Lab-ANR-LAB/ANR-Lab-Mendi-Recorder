"""Loopback WebSocket -> raw Mendi LSL streams. Python 3.10+."""
import argparse
import asyncio
import json
import math
import re
import uuid

from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed

ALLOWED_ORIGINS = [f"http://{host}:{port}" for host in ("localhost", "127.0.0.1") for port in (5173, 4173)]
CHANNELS = {
    "optical": ["left_red", "left_ir", "right_red", "right_ir"],
    "imu": ["acc_x", "acc_y", "acc_z", "gyro_x", "gyro_y", "gyro_z"],
    "quality": ["repeated_values", "poll_read", "sequence"],
    "events": ["event_json"],
}
NAMES = {"optical": "ANR_Mendi_Optical", "imu": "ANR_Mendi_IMU",
         "quality": "ANR_Mendi_Quality", "events": "ANR_Mendi_Events"}


def finite(value, name):
    if type(value) not in (int, float) or not math.isfinite(value):
        raise ValueError(f"{name} must be a finite number")
    return float(value)


def vector(value, size, name):
    if not isinstance(value, list) or len(value) != size:
        raise ValueError(f"{name} must have {size} entries")
    return [float("nan") if entry is None else finite(entry, name) for entry in value]


def sequence(value, previous):
    if type(value) is not int or value <= previous:
        raise ValueError("sequence must be a strictly increasing positive integer")
    return value


class BridgeSession:
    """Protocol validation and clock mapping, independent of WebSocket/LSL I/O."""

    def __init__(self, outlet_factory, clock):
        self.outlet_factory = outlet_factory
        self.clock = clock
        self.run_id = None
        self.outlets = {}
        self.offset = 0
        self.sample_sequence = 0
        self.event_sequence = 0
        self.last_sample_ms = -1

    def handle(self, message):
        if not isinstance(message, dict) or type(message.get("schema_version")) is not int or message["schema_version"] != 1:
            raise ValueError("Expected a schema_version 1 message object")
        kind = message.get("type")
        if kind == "sync":
            sent = finite(message.get("client_send_ms"), "client_send_ms")
            return dict(type="sync", client_send_ms=sent, server_time_s=self.clock())
        if kind == "start":
            return self.start(message)
        if not self.run_id or message.get("run_id") != self.run_id:
            raise ValueError("Start the matching session before publishing data")
        if kind == "stop":
            self.close()
            return dict(type="stopped")
        timestamp_ms = finite(message.get("timestamp_ms"), "timestamp_ms")
        if timestamp_ms < 0:
            raise ValueError("timestamp_ms cannot be negative")
        timestamp = timestamp_ms / 1000 + self.offset
        if not math.isfinite(timestamp):
            raise ValueError("Mapped timestamp is not finite")
        if kind == "sample":
            self.sample(message, timestamp_ms, timestamp)
        elif kind == "event":
            self.event(message, timestamp)
        else:
            raise ValueError("Unknown message type")
        return None

    def start(self, message):
        run_id = message.get("run_id")
        if not isinstance(run_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", run_id):
            raise ValueError("run_id must be a short random identifier")
        offset = finite(message.get("clock_offset_s"), "clock_offset_s")
        rtt = finite(message.get("clock_rtt_ms"), "clock_rtt_ms")
        if not 0 <= rtt <= 2000:
            raise ValueError("Clock round trip is outside the supported range")
        self.close()
        segment = uuid.uuid4().hex
        outlets = {}
        for kind, channels in CHANNELS.items():
            outlets[kind] = self.outlet_factory(dict(kind=kind, name=NAMES[kind], channels=channels,
                run_id=run_id, source_id=f"anr-mendi-{run_id}-{segment}-{kind}", clock_rtt_ms=rtt))
        self.outlets = outlets
        self.run_id = run_id
        self.offset = offset
        self.sample_sequence = self.event_sequence = 0
        self.last_sample_ms = -1
        return dict(type="started", run_id=run_id)

    def sample(self, message, timestamp_ms, timestamp):
        seq = sequence(message.get("sequence"), self.sample_sequence)
        if timestamp_ms < self.last_sample_ms:
            raise ValueError("Sample receipt timestamps must not go backwards")
        optical = vector(message.get("optical"), 4, "optical")
        imu = vector(message.get("imu"), 6, "imu")
        if not any(math.isfinite(v) for v in optical):
            raise ValueError("At least one optical channel must contain a measurement")
        if type(message.get("repeated")) is not bool or type(message.get("poll")) is not bool:
            raise ValueError("repeated and poll must be booleans")
        # Validate the complete sample before any outlet side effect.
        self.outlets["optical"].push_sample(optical, timestamp)
        if any(math.isfinite(v) for v in imu):
            self.outlets["imu"].push_sample(imu, timestamp)
        self.outlets["quality"].push_sample([int(message["repeated"]), int(message["poll"]), seq], timestamp)
        self.sample_sequence = seq
        self.last_sample_ms = timestamp_ms

    def event(self, message, timestamp):
        seq = sequence(message.get("sequence"), self.event_sequence)
        event = message.get("event")
        if not isinstance(event, dict) or not isinstance(event.get("description"), str):
            raise ValueError("event requires a description")
        if len(event["description"]) > 4096:
            raise ValueError("event description is too long")
        if finite(event.get("onset"), "event.onset") < 0:
            raise ValueError("event onset cannot be negative")
        text = json.dumps(event, ensure_ascii=False, allow_nan=False, separators=(",", ":"))
        self.outlets["events"].push_sample([text], timestamp)
        self.event_sequence = seq

    def close(self):
        self.outlets.clear()
        self.run_id = None


def lsl_outlet(spec):
    from pylsl import StreamInfo, StreamOutlet, IRREGULAR_RATE, cf_double64, cf_string
    is_event = spec["kind"] == "events"
    stream_type = "Markers" if is_event else "MendiRaw" if spec["kind"] == "optical" else "MendiAux"
    info = StreamInfo(spec["name"], stream_type, len(spec["channels"]), IRREGULAR_RATE,
                      cf_string if is_event else cf_double64, spec["source_id"])
    desc = info.desc()
    desc.append_child_value("manufacturer", "Mendi")
    desc.append_child_value("run_id", spec["run_id"])
    desc.append_child_value("schema_version", "1")
    desc.append_child_value("measurement", "raw_device_values_unvalidated")
    desc.append_child_value("timestamp_basis", "browser_monotonic_receipt_or_original_event_onset")
    desc.append_child_value("clock_round_trip_ms", str(spec["clock_rtt_ms"]))
    desc.append_child_value("freshness", "unverified; inspect ANR_Mendi_Quality and recorder warnings")
    channels = desc.append_child("channels")
    for label in spec["channels"]:
        channel = channels.append_child("channel")
        channel.append_child_value("label", label)
        channel.append_child_value("type", "misc" if not is_event else "stim")
        channel.append_child_value("unit", "text" if is_event else "raw_device_units" if spec["kind"] in ("optical", "imu") else "unitless")
    return StreamOutlet(info, chunk_size=1, max_buffered=120)


class BridgeServer:
    def __init__(self, outlet_factory=lsl_outlet, clock=None):
        if clock is None:
            from pylsl import local_clock
            clock = local_clock
        self.clock = clock
        self.outlet_factory = outlet_factory
        self.active = False

    async def handle(self, websocket):
        if self.active:
            await websocket.send(json.dumps(dict(type="error", message="Another recorder is already connected.")))
            await websocket.close(code=1008)
            return
        self.active = True
        session = BridgeSession(self.outlet_factory, self.clock)
        try:
            async for text in websocket:
                try:
                    reply = session.handle(json.loads(text))
                except (ValueError, TypeError, OverflowError) as error:
                    reply = dict(type="error", message=str(error))
                if reply is not None:
                    await websocket.send(json.dumps(reply, allow_nan=False))
        except ConnectionClosed:
            pass
        finally:
            session.close()
            self.active = False


async def main(port, extra_origins):
    server = BridgeServer()
    origins = ALLOWED_ORIGINS + extra_origins
    async with serve(server.handle, "127.0.0.1", port, origins=origins,
                     max_size=16384, max_queue=32, compression=None):
        print(f"Mendi LSL bridge ready at ws://127.0.0.1:{port}", flush=True)
        print("Open the local recorder and choose Connect bridge. Ctrl+C stops the bridge.", flush=True)
        await asyncio.Future()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--origin", action="append", default=[], help="Additional exact local browser origin")
    args = parser.parse_args()
    for origin in args.origin:
        if not re.fullmatch(r"http://(?:localhost|127\.0\.0\.1):\d{1,5}", origin):
            parser.error("Additional origins must be explicit loopback HTTP origins")
    try:
        asyncio.run(main(args.port, args.origin))
    except KeyboardInterrupt:
        pass
    except (ImportError, RuntimeError, OSError) as error:
        parser.exit(1, f"Bridge could not start: {error}\nSee bridge/README.md for dependency and liblsl setup.\n")
