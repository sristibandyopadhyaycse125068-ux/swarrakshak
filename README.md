# 🛡️ SwarRakshak (स्वररक्षक)

> **Privacy-Aware Voice-Risk Assistant for Financial Operations & Enterprise Protection**

[![Python Version](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

**SwarRakshak** is a privacy-first voice impersonation risk detection system designed to safeguard bank finance operators, corporate executives, and administrative personnel against AI-generated voice cloning attacks. 

When an attacker uses a cloned voice combined with leaked metadata to request an urgent wire transfer or password change, SwarRakshak analyzes short call audio samples alongside call context to deliver a **transparent 0–100 risk score**, human-readable explanations, and actionable protocol recommendations before sensitive actions are approved.

---

## ✨ Key Features

- **🎙️ Acoustic Voice Authenticity Analysis:** Extracts active speech frame spectral flatness, formant peak-to-valley contrast, and vocoder phase noise to detect AI synthetic speech.
- **🗣️ Optional Speaker Verification:** Calculates cosine similarity embeddings between the current call voice and a trusted reference sample.
- **📋 Contextual Threat Evaluation:** Factors in unknown caller IDs, high transaction amounts, time pressure urgency, and authorization bypass requests.
- **🔒 Zero-Retention Privacy:** Raw audio is processed in-memory / temporary space and **deleted immediately after feature extraction**. Only non-confidential metadata is stored in SQLite.
- **🖥️ Modern Glassmorphism Dashboard:** Interactive React dashboard featuring live browser mic recording, interactive context toggles, segment timelines, 1-click demo presets, and a searchable Fraud Analyst Audit Portal.

---

## 🏗 System Architecture & Risk Engine

```
                      +---------------------------------------+
                      |         React Frontend (Vite)         |
                      |  - Live Microphone Audio Recorder     |
                      |  - Call Context Form & Danger Flags   |
                      |  - Real-time Progress & Timeline      |
                      |  - Risk Result & Explanations         |
                      |  - Fraud Analyst Audit Portal         |
                      +------------------+--------------------+
                                         |
                                  REST API (JSON / FormData)
                                         |
                      +------------------v--------------------+
                      |        FastAPI Backend Service        |
                      |  - Audio Processor & Speech Masker    |
                      |  - Model Adapter & Acoustic Extractor |
                      |  - Multi-modal Risk Engine (0-100)    |
                      |  - Privacy Auto-Cleanup Loop          |
                      +------------------+--------------------+
                                         |
                                    SQLite DB
                         (Metadata, Results, Audit Log)
```

### Risk Level Scoring Model

| Risk Level | Score Range | Recommended Protocol Action |
| :--- | :--- | :--- |
| 🟢 **LOW** | **0 – 29** | Proceed with standard business operational procedures. |
| 🟡 **MEDIUM** | **30 – 59** | Exercise caution. Ask pre-agreed security verification question or request MFA. |
| 🔴 **HIGH** | **60 – 100** | **PAUSE ACTION IMMEDIATELY.** Perform independent callback using verified internal number. |

---

## 📂 Project Directory Structure

```
SwarRakshak/
├── backend/                  # FastAPI Backend Application
│   ├── app/
│   │   ├── main.py           # FastAPI entry point & CORS configuration
│   │   ├── database.py       # SQLite database engine & session management
│   │   ├── models.py         # SQLAlchemy ORM models (Event, Context, Result, Reasons, Segments)
│   │   ├── schemas.py        # Pydantic request & response schemas
│   │   ├── routes/
│   │   │   └── analyses.py   # REST API endpoints (/health, /analyses)
│   │   └── services/
│   │       ├── audio_processor.py # Audio segmenting & file auto-cleanup
│   │       ├── model_adapter.py   # Acoustic feature extraction & ML inference
│   │       └── risk_engine.py     # Multimodal risk scoring & recommendation engine
│   ├── tests/
│   │   └── test_api.py       # Automated Pytest test suite
│   └── requirements.txt      # Python dependencies
├── frontend/                 # React Single-Page Application (Vite)
│   ├── src/
│   │   ├── components/       # UI Components (Navbar, AudioUpload, ContextForm, ResultCard, AnalystPortal)
│   │   ├── services/api.js   # REST API service client
│   │   ├── App.jsx           # Main application router & state machine
│   │   └── index.css         # Tailwind CSS v4 design tokens & glassmorphism theme
│   ├── package.json          # Node dependencies
│   └── vite.config.js        # Vite dev server & proxy settings
└── IMP DOCS/                 # Product Specifications (PRD, API Spec, DB Design, Architecture)
```

---

## 🛠 Quick Start Guide

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ and npm

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run backend server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- API Health Check: `http://localhost:8000/api/v1/health`
- Swagger Interactive API Documentation: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Run Vite dev server
npm run dev -- --port 3000
```
- Open Web Application: `http://localhost:3000`

---

## 🧪 Testing & Verification

### Run Backend Test Suite
```bash
cd backend
python -m pytest
```
All 5 integration tests check API liveness, audio segmentation, database ORM transactions, and risk score accuracy.

### Build Frontend Production Bundle
```bash
cd frontend
npm run build
```

---

## ⚖️ Privacy & Compliance Notice

SwarRakshak is designed according to zero-retention privacy principles:
- Raw call audio files are processed temporarily in volatile memory and deleted immediately following feature extraction.
- No confidential speech audio bytes or raw call transcripts are stored in SQLite or application logs.
- The system serves as a decision-support risk assistant and does not automatically execute financial transactions or block carrier telecom calls.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
