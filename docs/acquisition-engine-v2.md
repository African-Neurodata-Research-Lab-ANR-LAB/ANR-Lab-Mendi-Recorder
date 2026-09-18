# Mendi Acquisition Engine v2

## Overview

The Acquisition Engine v2 upgrade introduces a research-focused streaming architecture for the ANR Lab Mendi Recorder.

The goal is to provide a reliable path from Mendi BLE acquisition to validated raw signal recording before advanced processing.

## Architecture

```
Mendi Device
    |
    v
BLE Notification Layer
    |
    v
Notification Pipeline
    |
    +-------------------+
    |                   |
Frame Validator   Packet Inspector
    |                   |
    +-------------------+
            |
            v
Stream Quality Engine
            |
            v
Stream Manager
            |
    +-------+-------+
    |               |
Recorder       Visualization
```

## Components

### Stream Manager

Central data distribution layer. It separates BLE acquisition from downstream modules such as decoding, recording, and visualization.

### Session Manager

Handles acquisition lifecycle:

- session creation
- start/stop state
- metadata tracking

### Frame Validator

Provides stream integrity checks:

- frame fingerprinting
- duplicate detection
- freshness estimation

### Stream Quality Engine

Calculates acquisition quality metrics:

- freshness percentage
- duplicate rate
- frame rate
- stream state

### Packet Inspector

Provides low-level diagnostics:

- packet size
- timestamps
- packet statistics
- duplicate information

### Mendi Watchdog

Monitors stream health and detects stale acquisition periods.

## Data Policy

The pipeline preserves raw Mendi optical and sensor data. No HbO/HbR estimation is performed at this stage.

Future fNIRS processing should occur after validated raw acquisition and quality control.

## Future Extensions

Possible future additions:

- motion correction
- optical signal preprocessing
- MBLL processing
- SNIRF/BIDS export
- LSL integration

## Development Workflow

Development occurs through feature branches before merging into the stable main branch.
