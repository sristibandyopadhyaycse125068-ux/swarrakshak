from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    audio_model: str
    speaker_model: str
    checked_at: str

class ContextData(BaseModel):
    caller_number_status: str # known, unknown, hidden
    request_urgency: str # normal, urgent
    transaction_value: str # low, medium, high
    procedure_status: str # normal, bypass_requested
    caller_relationship: str # customer, vendor, executive, unknown
    notes: Optional[str] = None

class AudioAnalysisData(BaseModel):
    available: bool
    synthetic_probability: Optional[float] = None
    spectral_flatness_avg: Optional[float] = None

class SpeakerAnalysisData(BaseModel):
    available: bool
    similarity: Optional[float] = None
    confidence_score: Optional[float] = None

class ReasonItem(BaseModel):
    reason_code: str
    message: str
    contribution: int
    source: str
    display_order: int

class SegmentItem(BaseModel):
    segment_number: int
    start_seconds: float
    end_seconds: float
    synthetic_probability: Optional[float] = None
    confidence_score: Optional[float] = None
    status: str

class AnalysisResponse(BaseModel):
    event_id: str
    status: str
    created_at: str
    completed_at: Optional[str] = None
    risk_score: int
    risk_level: str # low, medium, high, inconclusive
    confidence_level: str
    confidence_score: float
    evidence_sufficient: bool
    audio_analysis: AudioAnalysisData
    speaker_analysis: SpeakerAnalysisData
    context: ContextData
    reasons: List[ReasonItem]
    segments: List[SegmentItem]
    recommended_action: str
    privacy_status: str
    model_version: str
    rules_version: str

class AnalysisSummaryItem(BaseModel):
    event_id: str
    created_at: str
    status: str
    risk_score: int
    risk_level: str
    confidence_level: str
    evidence_sufficient: bool
    caller_number_status: str
    request_urgency: str
    transaction_value: str
    procedure_status: str
    caller_relationship: str
    reasons_count: int

class AnalysisListResponse(BaseModel):
    items: List[AnalysisSummaryItem]
    total: int
    page: int
    page_size: int
    pages: int

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str

class ErrorPayload(BaseModel):
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    request_id: Optional[str] = None

class ErrorResponseBody(BaseModel):
    error: ErrorPayload
