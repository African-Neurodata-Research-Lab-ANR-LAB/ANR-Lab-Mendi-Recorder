# Mendi Protocol Notes

Validated project information is recorded in the approved Recorder specification.

Custom service:
`fc3eabb0-c6c4-49e6-922a-6e551c455af5`

ABB1: frame data
ABB2: sensor/control path
ABB3: reserved control path
ABB4: ADC/battery telemetry
ABB5: diagnostics
ABB6: calibration/mode

Continuous ABB1 browser streaming is a hardware-validation item, not an assumption.

The application must never send undocumented control writes.
