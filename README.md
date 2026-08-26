# ANR Lab Mendi Recorder v4

African Neurodata Research Lab (ANR Lab)
University of Port Harcourt

## v4: Device Protocol + Research Capture Foundation

v4 introduces:
- validated BLE configuration workflow
- notification stream architecture
- raw packet preservation
- device metadata capture
- research session structure

Pipeline:

Mendi Device
 -> BLE Notification
 -> Packet Parser
 -> Raw Session Recorder
 -> ZIP Export
 -> NIRS/SNIRF Pipeline

