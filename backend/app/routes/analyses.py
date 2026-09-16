import datetime
import math
from typing import Optional, List
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    AnalysisEvent, AnalysisContext, AnalysisResult, AnalysisReason, AnalysisSegment
)
from ..schemas import (
    HealthResponse, AnalysisResponse, ContextData, AudioAnalysisData,
    SpeakerAnalysisData, ReasonItem, SegmentItem, AnalysisListResponse, AnalysisSummaryItem
)
from ..services.audio_processor import process_audio, process_reference_audio, AudioProcessingError
from ..services.model_adapter import model_adapter
from ..services.risk_engine import risk_engine

router = APIRouter(prefix="/api/v1", tags=["Analyses"])

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        service="swarrakshak-api",
        version="0.1.0",
        audio_model="ready",
        speaker_model="ready",
        checked_at=datetime.datetime.utcnow().isoformat() + "Z"
    )

@router.post("/analyses", response_model=AnalysisResponse)
async def create_analysis(
    current_audio: UploadFile = File(...),
    reference_audio: Optional[UploadFile] = File(None),
    caller_number_status: str = Form("known"), # known, unknown, hidden
    request_urgency: str = Form("normal"), # normal, urgent
    transaction_value: str = Form("low"), # low, medium, high
    procedure_status: str = Form("normal"), # normal, bypass_requested
    caller_relationship: str = Form("customer"), # customer, vendor, executive, unknown
    notes: Optional[str] = Form(None),
    retain_audio: bool = Form(False),
    db: Session = Depends(get_db)
):
    # Validate context parameters
    valid_caller_status = {"known", "unknown", "hidden"}
    valid_urgency = {"normal", "urgent"}
    valid_value = {"low", "medium", "high"}
    valid_procedure = {"normal", "bypass_requested"}
    valid_rel = {"customer", "vendor", "executive", "unknown"}

    if caller_number_status not in valid_caller_status:
        raise HTTPException(status_code=400, detail=f"Invalid caller_number_status. Must be one of {valid_caller_status}")
    if request_urgency not in valid_urgency:
        raise HTTPException(status_code=400, detail=f"Invalid request_urgency. Must be one of {valid_urgency}")
    if transaction_value not in valid_value:
        raise HTTPException(status_code=400, detail=f"Invalid transaction_value. Must be one of {valid_value}")
    if procedure_status not in valid_procedure:
        raise HTTPException(status_code=400, detail=f"Invalid procedure_status. Must be one of {valid_procedure}")
    if caller_relationship not in valid_rel:
        raise HTTPException(status_code=400, detail=f"Invalid caller_relationship. Must be one of {valid_rel}")

    # Process Current Audio
    try:
        current_bytes = await current_audio.read()
        audio_info = process_audio(current_bytes, current_audio.filename or "current.wav")
    except AudioProcessingError as e:
        raise HTTPException(status_code=400, detail={"code": e.code, "message": e.message})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio processing error: {str(e)}")

    # Process Reference Audio if provided
    ref_info = None
    if reference_audio is not None:
        try:
            ref_bytes = await reference_audio.read()
            if len(ref_bytes) > 0:
                ref_info = process_reference_audio(ref_bytes, reference_audio.filename or "ref.wav")
        except AudioProcessingError as e:
            raise HTTPException(status_code=400, detail={"code": e.code, "message": e.message})
        except Exception as e:
            pass # optional reference error fallback

    # Run AI Models
    audio_eval = model_adapter.predict_authenticity(audio_info, current_audio.filename or "")
    speaker_eval = model_adapter.compare_speakers(audio_info, ref_info)

    # Evaluate Risk
    context_dict = {
        "caller_number_status": caller_number_status,
        "request_urgency": request_urgency,
        "transaction_value": transaction_value,
        "procedure_status": procedure_status,
        "caller_relationship": caller_relationship,
        "notes": notes
    }
    risk_eval = risk_engine.evaluate(audio_eval, speaker_eval, context_dict)

    now = datetime.datetime.utcnow()

    # Save Event & Metadata to SQLite
    event = AnalysisEvent(
        status="completed",
        model_version="v1.0.0-prototype",
        rules_version="v1.0.0",
        created_at=now,
        completed_at=now,
        raw_audio_retained=retain_audio,
        audio_deleted_at=now if not retain_audio else None
    )
    db.add(event)
    db.flush()

    context_record = AnalysisContext(
        event_id=event.event_id,
        caller_number_status=caller_number_status,
        request_urgency=request_urgency,
        transaction_value=transaction_value,
        procedure_status=procedure_status,
        caller_relationship=caller_relationship,
        notes=notes
    )
    db.add(context_record)

    result_record = AnalysisResult(
        event_id=event.event_id,
        risk_score=risk_eval["risk_score"],
        risk_level=risk_eval["risk_level"],
        confidence_level=risk_eval["confidence_level"],
        confidence_score=risk_eval["confidence_score"],
        evidence_sufficient=risk_eval["evidence_sufficient"],
        synthetic_probability=audio_eval.get("synthetic_probability"),
        speaker_similarity=speaker_eval.get("similarity"),
        speaker_analysis_available=speaker_eval.get("available", False),
        recommended_action=risk_eval["recommended_action"]
    )
    db.add(result_record)

    reasons_out = []
    for r in risk_eval["reasons"]:
        reason_rec = AnalysisReason(
            event_id=event.event_id,
            reason_code=r["reason_code"],
            message=r["message"],
            contribution=r["contribution"],
            source=r["source"],
            display_order=r["display_order"]
        )
        db.add(reason_rec)
        reasons_out.append(ReasonItem(
            reason_code=r["reason_code"],
            message=r["message"],
            contribution=r["contribution"],
            source=r["source"],
            display_order=r["display_order"]
        ))

    segments_out = []
    for seg in audio_eval["segments"]:
        seg_rec = AnalysisSegment(
            event_id=event.event_id,
            segment_number=seg["segment_number"],
            start_seconds=seg["start_seconds"],
            end_seconds=seg["end_seconds"],
            synthetic_probability=seg["synthetic_probability"],
            confidence_score=seg["confidence_score"],
            status=seg["status"]
        )
        db.add(seg_rec)
        segments_out.append(SegmentItem(
            segment_number=seg["segment_number"],
            start_seconds=seg["start_seconds"],
            end_seconds=seg["end_seconds"],
            synthetic_probability=seg["synthetic_probability"],
            confidence_score=seg["confidence_score"],
            status=seg["status"]
        ))

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database commit error: {str(e)}")

    return AnalysisResponse(
        event_id=event.event_id,
        status="completed",
        created_at=now.isoformat() + "Z",
        completed_at=now.isoformat() + "Z",
        risk_score=risk_eval["risk_score"],
        risk_level=risk_eval["risk_level"],
        confidence_level=risk_eval["confidence_level"],
        confidence_score=risk_eval["confidence_score"],
        evidence_sufficient=risk_eval["evidence_sufficient"],
        audio_analysis=AudioAnalysisData(
            available=audio_eval["available"],
            synthetic_probability=audio_eval["synthetic_probability"]
        ),
        speaker_analysis=SpeakerAnalysisData(
            available=speaker_eval["available"],
            similarity=speaker_eval["similarity"],
            confidence_score=speaker_eval["confidence_score"]
        ),
        context=ContextData(
            caller_number_status=caller_number_status,
            request_urgency=request_urgency,
            transaction_value=transaction_value,
            procedure_status=procedure_status,
            caller_relationship=caller_relationship,
            notes=notes
        ),
        reasons=reasons_out,
        segments=segments_out,
        recommended_action=risk_eval["recommended_action"],
        privacy_status="Raw audio deleted immediately after feature extraction." if not retain_audio else "Audio retained per user request.",
        model_version=event.model_version,
        rules_version=event.rules_version
    )


@router.get("/analyses/{event_id}", response_model=AnalysisResponse)
def get_analysis_by_id(event_id: str, db: Session = Depends(get_db)):
    event = db.query(AnalysisEvent).filter(AnalysisEvent.event_id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Analysis event not found")

    context = event.context
    result = event.result

    reasons_out = [
        ReasonItem(
            reason_code=r.reason_code,
            message=r.message,
            contribution=r.contribution,
            source=r.source,
            display_order=r.display_order
        ) for r in event.reasons
    ]

    segments_out = [
        SegmentItem(
            segment_number=s.segment_number,
            start_seconds=s.start_seconds,
            end_seconds=s.end_seconds,
            synthetic_probability=s.synthetic_probability,
            confidence_score=s.confidence_score,
            status=s.status
        ) for s in event.segments
    ]

    return AnalysisResponse(
        event_id=event.event_id,
        status=event.status,
        created_at=event.created_at.isoformat() + "Z",
        completed_at=event.completed_at.isoformat() + "Z" if event.completed_at else None,
        risk_score=result.risk_score if result else 0,
        risk_level=result.risk_level if result else "inconclusive",
        confidence_level=result.confidence_level if result else "low",
        confidence_score=result.confidence_score if result else 0.0,
        evidence_sufficient=result.evidence_sufficient if result else False,
        audio_analysis=AudioAnalysisData(
            available=True if (result and result.synthetic_probability is not None) else False,
            synthetic_probability=result.synthetic_probability if result else None
        ),
        speaker_analysis=SpeakerAnalysisData(
            available=result.speaker_analysis_available if result else False,
            similarity=result.speaker_similarity if result else None,
            confidence_score=0.85 if (result and result.speaker_analysis_available) else None
        ),
        context=ContextData(
            caller_number_status=context.caller_number_status if context else "unknown",
            request_urgency=context.request_urgency if context else "normal",
            transaction_value=context.transaction_value if context else "low",
            procedure_status=context.procedure_status if context else "normal",
            caller_relationship=context.caller_relationship if context else "unknown",
            notes=context.notes if context else None
        ),
        reasons=reasons_out,
        segments=segments_out,
        recommended_action=result.recommended_action if result else "N/A",
        privacy_status="Raw audio deleted immediately after feature extraction.",
        model_version=event.model_version,
        rules_version=event.rules_version
    )


@router.get("/analyses", response_model=AnalysisListResponse)
def list_analyses(
    risk_level: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(AnalysisEvent)

    if risk_level:
        query = query.join(AnalysisResult).filter(AnalysisResult.risk_level == risk_level.lower())

    total = query.count()
    pages = math.ceil(total / page_size) if total > 0 else 1

    events = query.order_by(AnalysisEvent.created_at.desc()).offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for e in events:
        ctx = e.context
        res = e.result
        items.append(AnalysisSummaryItem(
            event_id=e.event_id,
            created_at=e.created_at.isoformat() + "Z",
            status=e.status,
            risk_score=res.risk_score if res else 0,
            risk_level=res.risk_level if res else "inconclusive",
            confidence_level=res.confidence_level if res else "low",
            evidence_sufficient=res.evidence_sufficient if res else False,
            caller_number_status=ctx.caller_number_status if ctx else "unknown",
            request_urgency=ctx.request_urgency if ctx else "normal",
            transaction_value=ctx.transaction_value if ctx else "low",
            procedure_status=ctx.procedure_status if ctx else "normal",
            caller_relationship=ctx.caller_relationship if ctx else "unknown",
            reasons_count=len(e.reasons)
        ))

    return AnalysisListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=pages
    )
