import datetime
import uuid
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    user_id = Column(String, primary_key=True, default=lambda: f"usr_{gen_uuid()[:8]}")
    display_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=True)
    role = Column(String, default="finance_user") # finance_user, fraud_analyst, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    active = Column(Boolean, default=True)

    events = relationship("AnalysisEvent", back_populates="user")


class AnalysisEvent(Base):
    __tablename__ = "analysis_events"

    event_id = Column(String, primary_key=True, default=lambda: f"evt_{gen_uuid()[:8]}")
    user_id = Column(String, ForeignKey("users.user_id"), nullable=True)
    status = Column(String, nullable=False, default="processing") # processing, completed, failed
    model_version = Column(String, default="v1.0.0-prototype")
    rules_version = Column(String, default="v1.0.0")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    completed_at = Column(DateTime, nullable=True)
    raw_audio_retained = Column(Boolean, default=False)
    audio_deleted_at = Column(DateTime, nullable=True)
    failure_code = Column(String, nullable=True)

    user = relationship("User", back_populates="events")
    context = relationship("AnalysisContext", uselist=False, back_populates="event", cascade="all, delete-orphan")
    result = relationship("AnalysisResult", uselist=False, back_populates="event", cascade="all, delete-orphan")
    reasons = relationship("AnalysisReason", back_populates="event", cascade="all, delete-orphan", order_by="AnalysisReason.display_order")
    segments = relationship("AnalysisSegment", back_populates="event", cascade="all, delete-orphan", order_by="AnalysisSegment.segment_number")


class AnalysisContext(Base):
    __tablename__ = "analysis_context"

    event_id = Column(String, ForeignKey("analysis_events.event_id"), primary_key=True)
    caller_number_status = Column(String, nullable=False) # known, unknown, hidden
    request_urgency = Column(String, nullable=False) # normal, urgent
    transaction_value = Column(String, nullable=False) # low, medium, high
    procedure_status = Column(String, nullable=False) # normal, bypass_requested
    caller_relationship = Column(String, nullable=False) # customer, vendor, executive, unknown
    notes = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    event = relationship("AnalysisEvent", back_populates="context")


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    result_id = Column(String, primary_key=True, default=lambda: f"res_{gen_uuid()[:8]}")
    event_id = Column(String, ForeignKey("analysis_events.event_id"), nullable=False, unique=True)
    risk_score = Column(Integer, nullable=False) # 0-100
    risk_level = Column(String, nullable=False, index=True) # low, medium, high, inconclusive
    confidence_level = Column(String, nullable=False, default="high") # low, medium, high
    confidence_score = Column(Float, nullable=False, default=0.85)
    evidence_sufficient = Column(Boolean, default=True)
    synthetic_probability = Column(Float, nullable=True)
    speaker_similarity = Column(Float, nullable=True)
    speaker_analysis_available = Column(Boolean, default=False)
    recommended_action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    event = relationship("AnalysisEvent", back_populates="result")


class AnalysisReason(Base):
    __tablename__ = "analysis_reasons"

    reason_id = Column(String, primary_key=True, default=lambda: f"rsn_{gen_uuid()[:8]}")
    event_id = Column(String, ForeignKey("analysis_events.event_id"), nullable=False, index=True)
    reason_code = Column(String, nullable=False, index=True)
    message = Column(String, nullable=False)
    contribution = Column(Integer, default=0)
    source = Column(String, default="rules_engine") # audio_model, speaker_model, rules_engine
    display_order = Column(Integer, default=1)

    event = relationship("AnalysisEvent", back_populates="reasons")


class AnalysisSegment(Base):
    __tablename__ = "analysis_segments"

    segment_id = Column(String, primary_key=True, default=lambda: f"seg_{gen_uuid()[:8]}")
    event_id = Column(String, ForeignKey("analysis_events.event_id"), nullable=False, index=True)
    segment_number = Column(Integer, nullable=False)
    start_seconds = Column(Float, nullable=False)
    end_seconds = Column(Float, nullable=False)
    synthetic_probability = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=True)
    status = Column(String, default="completed") # processing, completed, error
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    __table_args__ = (
        UniqueConstraint('event_id', 'segment_number', name='uq_event_segment'),
    )

    event = relationship("AnalysisEvent", back_populates="segments")
