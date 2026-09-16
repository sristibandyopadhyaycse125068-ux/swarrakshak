import os
import uuid
import tempfile
import numpy as np
import librosa
import soundfile as sf
from typing import Tuple, List, Dict, Any, Optional

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "temp_audio")
os.makedirs(TEMP_DIR, exist_ok=True)

MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB
MAX_DURATION_SECONDS = 60.0  # 60 s
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".m4a", ".ogg", ".webm", ".flac"}

class AudioProcessingError(Exception):
    def __init__(self, message: str, code: str = "INVALID_AUDIO"):
        self.message = message
        self.code = code
        super().__init__(message)

def save_temp_file(file_bytes: bytes, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    if not ext or ext not in ALLOWED_EXTENSIONS:
        ext = ".wav"
    
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise AudioProcessingError(
            f"File size ({len(file_bytes) / (1024*1024):.1f} MB) exceeds maximum allowed limit of 25 MB.",
            code="FILE_TOO_LARGE"
        )
    
    unique_name = f"temp_{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(TEMP_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(file_bytes)
    return file_path

def cleanup_file(file_path: Optional[str]):
    if file_path and os.path.exists(file_path):
        try:
            os.remove(file_path)
        except Exception:
            pass

def process_audio(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Decodes audio file bytes, validates duration & contents, extracts segments and spectral features,
    and guarantees raw file deletion in a finally block.
    """
    temp_path = None
    try:
        temp_path = save_temp_file(file_bytes, filename)
        
        # Load audio using librosa
        try:
            y, sr = librosa.load(temp_path, sr=16000, mono=True)
        except Exception as e:
            raise AudioProcessingError(
                f"Failed to decode audio file. Ensure file is a valid WAV, MP3, or M4A format: {str(e)}",
                code="CORRUPTED_AUDIO"
            )
        
        duration = float(librosa.get_duration(y=y, sr=sr))
        if duration <= 0.1:
            raise AudioProcessingError("Audio signal is too short or empty.", code="EMPTY_AUDIO")
        if duration > MAX_DURATION_SECONDS + 5.0:  # slight buffer
            raise AudioProcessingError(
                f"Audio duration ({duration:.1f}s) exceeds maximum limit of 60 seconds.",
                code="DURATION_EXCEEDED"
            )
        
        # Check signal energy / silent check
        rms = librosa.feature.rms(y=y)
        if np.max(rms) < 1e-4:
            raise AudioProcessingError("Audio file contains silent or noise-only recording.", code="SILENT_AUDIO")
        
        # Segment into 3-second chunks
        segment_duration = 3.0
        num_segments = max(1, int(np.ceil(duration / segment_duration)))
        segments = []
        
        for idx in range(num_segments):
            start = idx * segment_duration
            end = min(duration, (idx + 1) * segment_duration)
            start_sample = int(start * sr)
            end_sample = int(end * sr)
            y_seg = y[start_sample:end_sample]
            
            if len(y_seg) == 0:
                continue
                
            # Extract features per segment
            spectral_flatness = float(np.mean(librosa.feature.spectral_flatness(y=y_seg)))
            zero_crossing_rate = float(np.mean(librosa.feature.zero_crossing_rate(y=y_seg)))
            spectral_rolloff = float(np.mean(librosa.feature.spectral_rolloff(y=y_seg, sr=sr)))
            
            segments.append({
                "segment_number": idx + 1,
                "start_seconds": round(start, 2),
                "end_seconds": round(end, 2),
                "y_seg": y_seg,
                "spectral_flatness": spectral_flatness,
                "zero_crossing_rate": zero_crossing_rate,
                "spectral_rolloff": spectral_rolloff
            })
            
        return {
            "duration": duration,
            "sample_rate": sr,
            "audio_data": y,
            "segments": segments
        }
    finally:
        cleanup_file(temp_path)

def process_reference_audio(file_bytes: bytes, filename: str) -> Dict[str, Any]:
    """
    Processes reference voice audio file and ensures file deletion.
    """
    temp_path = None
    try:
        temp_path = save_temp_file(file_bytes, filename)
        y, sr = librosa.load(temp_path, sr=16000, mono=True)
        duration = float(librosa.get_duration(y=y, sr=sr))
        return {
            "duration": duration,
            "sample_rate": sr,
            "audio_data": y
        }
    except Exception as e:
        raise AudioProcessingError(f"Reference audio processing failed: {str(e)}", code="INVALID_REFERENCE")
    finally:
        cleanup_file(temp_path)
