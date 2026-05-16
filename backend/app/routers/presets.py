import json
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..db import get_session
from ..models import Preset
from ..schemas import PresetCreate, PresetRead

router = APIRouter(prefix="/presets", tags=["presets"])


@router.get("/", response_model=list[PresetRead])
def list_presets(session: Session = Depends(get_session)):
    presets = session.exec(select(Preset)).all()
    return [_to_read(p) for p in presets]


@router.get("/{name}", response_model=PresetRead)
def get_preset(name: str, session: Session = Depends(get_session)):
    preset = session.exec(select(Preset).where(Preset.name == name)).first()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    return _to_read(preset)


@router.post("/", response_model=PresetRead, status_code=201)
def create_preset(body: PresetCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(Preset).where(Preset.name == body.name)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Preset name already exists")
    preset = Preset(name=body.name, angles_json=json.dumps(body.angles))
    session.add(preset)
    session.commit()
    session.refresh(preset)
    return _to_read(preset)


@router.put("/{name}", response_model=PresetRead)
def update_preset(name: str, body: PresetCreate, session: Session = Depends(get_session)):
    preset = session.exec(select(Preset).where(Preset.name == name)).first()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    preset.angles_json = json.dumps(body.angles)
    session.add(preset)
    session.commit()
    session.refresh(preset)
    return _to_read(preset)


@router.delete("/{name}", status_code=204)
def delete_preset(name: str, session: Session = Depends(get_session)):
    preset = session.exec(select(Preset).where(Preset.name == name)).first()
    if not preset:
        raise HTTPException(status_code=404, detail="Preset not found")
    session.delete(preset)
    session.commit()


def _to_read(p: Preset) -> PresetRead:
    return PresetRead(id=p.id, name=p.name, angles=p.angles, created_at=p.created_at)
