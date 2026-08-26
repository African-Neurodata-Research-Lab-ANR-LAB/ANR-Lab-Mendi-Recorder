# ANR Lab Mendi Recorder v3

African Neurodata Research Lab (ANR Lab)
University of Port Harcourt

## v3: Real BLE Integration Foundation

New focus:
- Web Bluetooth connection layer
- Mendi device discovery
- Service/characteristic configuration
- Notification stream handling
- Raw packet capture
- Live recorder pipeline

Protocol UUIDs remain configurable until validated from APK reverse engineering.

Pipeline:

Mendi -> BLE -> Packet Receiver -> Parser -> Recorder -> Session Export
