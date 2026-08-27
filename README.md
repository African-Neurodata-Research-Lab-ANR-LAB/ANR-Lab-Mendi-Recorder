# 🧠 ANR Lab Mendi Recorder

## Browser-Based fNIRS Acquisition Platform for Mendi Neurotechnology Devices

Developed by:

**African Neurodata Research Lab (ANR Lab)**  
University of Port Harcourt

---

## Overview

ANR Lab Mendi Recorder is an open research platform designed for:

- wireless Mendi device acquisition
- real-time signal monitoring
- experimental event marking
- research session recording
- fNIRS data processing workflows
- SNIRF-compatible analysis preparation

---

## Architecture

Mendi Device

↓

Bluetooth Low Energy

↓

ANR Recorder

↓

Packet Decoder

↓

Session Manager

↓

Quality Control

↓

NIRS Pipeline

↓

Analysis

---

## Features

- BLE acquisition framework
- Live recording interface
- Automated markers
- Session export
- Metadata preservation
- NIRS processing preparation

---

## Repository Structure

core/      Device communication and recording engine

app/       Browser interface

nirs/      fNIRS processing pipeline

docs/      Documentation

examples/ Sample datasets

tests/     Testing

---

## Research Data Format

Sessions are stored as:

ANR_Mendi_Session.zip

Contains:

- raw_packets.csv
- metadata.json
- markers.csv
- device.json
- README.txt

---

## Status

Research prototype under active development.

