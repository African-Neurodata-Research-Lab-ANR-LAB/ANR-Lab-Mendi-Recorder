# Mendi live monitoring and LSL bridge

This optional bridge connects the existing browser recorder to LSL research
applications. The browser keeps raw recording and export working independently.
No headset connection is made by Python; the existing Web Bluetooth driver
remains responsible for Mendi acquisition.

## Windows setup

Install Node.js 22.12+ (24 LTS recommended) and Python 3.10+ with Bluetooth
available in Chrome or Edge. In PowerShell, from this repository:

```powershell
npm ci
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r bridge/requirements.txt
.\.venv\Scripts\python.exe bridge/mendi_lsl.py
```

Leave that terminal running. In a second terminal:

```powershell
npm run dev
```

Open http://localhost:5173/ANR-Lab-Mendi-Recorder/ in Chrome or Edge.
In **Local LSL bridge**, choose **Connect bridge**. Wait for **CONNECTED**.
Prepare your protocol, connect the headset, and start your session as usual.
The bridge changes to **STREAMING** after Python acknowledges the session.
Allow localhost/Bluetooth access if the browser requests it.

Use the local recorder URL for this workflow. The HTTPS GitHub Pages version
may block an unencrypted local WebSocket; it can still record without LSL.
If Vite reports a different port, either free port 5173 or explicitly permit
the new origin, for example `python bridge/mendi_lsl.py --origin http://localhost:5174`.
For another bridge port use `--port 8766` and update the bridge address in the UI.

On macOS/Linux use `python3 -m venv .venv` and `.venv/bin/python` for the
Python commands. Linux installations without a working bundled liblsl may
need the [official liblsl installation](https://github.com/labstreaminglayer/liblsl/releases)
and `PYLSL_LIB` pointing to the installed shared library. See the
[pylsl instructions](https://github.com/labstreaminglayer/pylsl).

## What the display means

Choose a 30, 60, or 120 second rolling window. Both sides show raw Red and
IR values; dashed lines mark tasks and other events using their session
onsets. Traces break at missing values and gaps longer than two seconds.
At session start the time axis fills from zero; after the window fills it
scrolls. The plot holds at most 20,000 samples independently of recorded data.

| Indicator | Interpretation |
| --- | --- |
| Last optical data | Seconds since a decoded optical frame arrived in the browser |
| Last value change | Seconds since the optical/IMU vector changed |
| Optical arrivals | Received optical frames per second, calculated from arrivals in the last five seconds |
| Consecutive repeats | Consecutive identical optical/IMU vectors after the first observation |
| Movement | Magnitude of the change in raw acceleration/gyro axes between received frames |
| STALE | No optical frame received for two seconds |
| REPEATED VALUES | At least three consecutive repeated vectors; inspect contact/movement |
| Unsent optical samples | Samples not sent because the optional bridge was unavailable or busy |

These are acquisition diagnostics. Neither changing values nor a high
arrival count validates biological freshness, contact, or neural activation.
Movement is in raw device units, not calibrated acceleration or angular speed.

## LSL streams

| Name | Channels | Data |
| --- | --- | --- |
| ANR_Mendi_Optical | left_red, left_ir, right_red, right_ir | Raw device values |
| ANR_Mendi_IMU | acc_x/y/z, gyro_x/y/z | Raw movement fields |
| ANR_Mendi_Quality | repeated_values, poll_read, sequence | Flags and sample sequence aligned with optical timestamps |
| ANR_Mendi_Events | event_json | Original marker object, including onset and description |

All streams declare an **irregular nominal rate** because the device's
sampling frequency is not validated. Missing numeric values are NaN; an
entirely absent IMU vector is not published. Repeated observations are
preserved and flagged; they must not be treated as confirmed new sensor
measurements. Outlets are created at session start, so consumers should
connect after **STREAMING** appears. Each connection/session segment has a
unique source ID and a random run ID unrelated to participant identifiers.

The WebSocket listener is restricted to loopback and approved local origins,
with one recorder connected at a time. LSL discovery may make the streams
available to compatible applications on the local network; use the lab's
normal network configuration for research data.

## Timing, gaps and reconnects

Five clock exchanges map browser `performance.now()` to `pylsl.local_clock()`;
the exchange with the lowest round-trip delay is used for that connection.
The UI and LSL metadata report that round-trip delay. This is an estimated
software clock alignment, not a hardware synchronization guarantee.

Optical timestamps represent browser receipt time, **not a device sampling
clock**. Marker timestamps equal the session's monotonic start plus original
marker onset, even when JavaScript timers or transmission delay their delivery.
Scheduled onset and actual stimulus presentation may differ. The bridge keeps
the mapping fixed for a connection; long-session drift has not been measured.

Bridge errors do not stop local recording. Reconnect with **Connect bridge**;
the new connection starts a new LSL segment, so consumers must resolve it
again. There is no optical backlog replay. Unsent markers may be transmitted
when the connection recovers while the session remains active, preserving
their earlier timestamps; markers left unsent at session end remain in the
manifest. The local manifest is the complete recording source.

## Read raw data with MNE-LSL

After installing `mne-lsl` in an analysis environment and starting a session:

```python
from mne_lsl.stream import StreamLSL

# For irregular-rate streams, bufsize is a number of samples.
stream = StreamLSL(bufsize=1000, name="ANR_Mendi_Optical").connect()
try:
    data, timestamps = stream.get_data()
    print(data.shape, timestamps)  # channels x samples, LSL-clock seconds
finally:
    stream.disconnect()
```

Wait for data to arrive before taking a snapshot; do not assume 10 Hz or
another rate. Channels are `misc` raw values. MNE-NIRS haemoglobin conversion
is deliberately not called: wavelengths, optode geometry, pathlength
assumptions and continuous acquisition need validation first. The old
unvalidated Hb preview methods are now disabled.

## Verification

```powershell
npm test -- --run
npm run build
.\.venv\Scripts\python.exe -m unittest discover -s bridge -p "test_*.py"
.\.venv\Scripts\python.exe bridge/smoke_lsl.py
```

The last command publishes explicitly synthetic samples through a real
loopback WebSocket and four real LSL outlets/inlets. It checks channel order,
repeat flags and event timing. It does not validate the physical Mendi.

For hardware acceptance, start a short session, verify optical values change
with contact and raw IMU with movement, and confirm changes continue over
several minutes. Check a task marker against the exported onset. Disconnect
Bluetooth and confirm the stale warning and visible time gap; reconnect and
confirm new values resume. Stop the bridge and verify recording/export still
work while unsent samples increase. Export and inspect the raw data before
starting any scientific conversion. No undocumented BLE control writes were
added by this integration.
