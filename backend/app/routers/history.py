from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db import get_session
from ..models import HistoryEntry
from ..schemas import HistoryEntryRead
from ..config import settings

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/", response_model=list[HistoryEntryRead])
def get_history(session: Session = Depends(get_session)):
    entries = session.exec(
        select(HistoryEntry).order_by(HistoryEntry.id.desc()).limit(settings.history_limit)
    ).all()
    return [
        HistoryEntryRead(
            id=e.id,
            command_type=e.command_type,
            payload_json=e.payload_json,
            created_at=e.created_at,
        )
        for e in entries
    ]


@router.delete("/", status_code=204)
def clear_history(session: Session = Depends(get_session)):
    entries = session.exec(select(HistoryEntry)).all()
    for e in entries:
        session.delete(e)
    session.commit()
