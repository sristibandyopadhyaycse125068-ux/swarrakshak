import io
import pytest
import numpy as np
import soundfile as sf
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def create_dummy_wav_bytes(duration_sec=3.0, sample_rate=16000):
    t = np.linspace(0, duration_sec, int(sample_rate * duration_sec), False)
    # Generate 440 Hz sine wave with noise
    signal = 0.5 * np.sin(2 * np.pi * 440 * t) + 0.05 * np.random.normal(size=len(t))
    buf = io.BytesIO()
    sf.write(buf, signal, sample_rate, format='WAV')
    buf.seek(0)
    return buf.read()

def test_health_check():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "swarrakshak-api"
    assert "checked_at" in data

def test_create_analysis_success():
    wav_bytes = create_dummy_wav_bytes(duration_sec=3.0)
    
    files = {
        "current_audio": ("test_call.wav", wav_bytes, "audio/wav")
    }
    data = {
        "caller_number_status": "unknown",
        "request_urgency": "urgent",
        "transaction_value": "high",
        "procedure_status": "bypass_requested",
        "caller_relationship": "executive",
        "notes": "Test wire transfer request"
    }

    response = client.post("/api/v1/analyses", files=files, data=data)
    assert response.status_code == 200, response.text
    res = response.json()
    assert res["status"] == "completed"
    assert "evt_" in res["event_id"]
    assert res["risk_score"] > 0
    assert res["risk_level"] in ["low", "medium", "high"]
    assert len(res["reasons"]) > 0
    assert len(res["segments"]) > 0

def test_create_analysis_invalid_context():
    wav_bytes = create_dummy_wav_bytes(duration_sec=2.0)
    files = {"current_audio": ("test.wav", wav_bytes, "audio/wav")}
    data = {
        "caller_number_status": "invalid_status",
        "request_urgency": "normal",
        "transaction_value": "low",
        "procedure_status": "normal",
        "caller_relationship": "customer"
    }
    response = client.post("/api/v1/analyses", files=files, data=data)
    assert response.status_code == 400

def test_list_analyses():
    response = client.get("/api/v1/analyses")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data

def test_get_analysis_by_id():
    wav_bytes = create_dummy_wav_bytes(duration_sec=3.0)
    files = {"current_audio": ("test_call.wav", wav_bytes, "audio/wav")}
    data = {
        "caller_number_status": "known",
        "request_urgency": "normal",
        "transaction_value": "low",
        "procedure_status": "normal",
        "caller_relationship": "vendor"
    }
    create_res = client.post("/api/v1/analyses", files=files, data=data).json()
    event_id = create_res["event_id"]

    get_res = client.get(f"/api/v1/analyses/{event_id}")
    assert get_res.status_code == 200
    fetched = get_res.json()
    assert fetched["event_id"] == event_id
    assert fetched["risk_level"] == create_res["risk_level"]
    assert fetched["audio_analysis"]["synthetic_probability"] == create_res["audio_analysis"]["synthetic_probability"]

