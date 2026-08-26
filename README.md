# ANR Lab Mendi Recorder v2

African Neurodata Research Lab (ANR Lab)
University of Port Harcourt

## v2 Upgrade

Added foundations for:
- Web Bluetooth integration
- Mendi BLE configuration
- Live packet handling
- Signal dashboard
- Recorder pipeline
- Auto markers

## Architecture

Mendi Device
 -> Web Bluetooth
 -> Packet Parser
 -> Recorder
 -> Session Export
 -> NIRS/SNIRF Pipeline

Note:
BLE UUID values are kept configurable and will be populated after protocol validation from the APK analysis.
