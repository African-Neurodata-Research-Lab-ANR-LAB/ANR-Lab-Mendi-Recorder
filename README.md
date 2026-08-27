# ANR Lab Mendi Recorder v9

African Neurodata Research Lab (ANR Lab)
University of Port Harcourt

## v9: Research Session Export Layer

v9 introduces:

- session packaging architecture
- metadata capture
- raw packet storage format
- marker storage
- device information storage
- analysis-ready session structure

Pipeline:

Mendi Device
 -> BLE Stream
 -> Packet Decoder
 -> Session Recorder
 -> ANR_Mendi_Session.zip
 -> NIRS Processing
