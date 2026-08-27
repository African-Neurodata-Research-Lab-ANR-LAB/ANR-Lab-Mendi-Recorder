# ANR Lab Mendi Recorder v1.0

African Neurodata Research Lab (ANR Lab)
University of Port Harcourt

A browser-based research recorder architecture for Mendi neurotechnology devices.

## Platform Goals

- BLE acquisition
- Real-time signal monitoring
- Automated event markers
- Research session recording
- NIRS processing pipeline
- SNIRF-compatible analysis workflow

## Architecture

Mendi Device
-> BLE Layer
-> Decoder
-> Recorder
-> Export
-> NIRS Pipeline
-> Analyzer
