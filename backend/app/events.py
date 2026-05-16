import asyncio
import json
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import Session
from .db import create_db_and_tables, engine
from .models import Preset
from .services.motion_engine import motion_loop

logger = logging.getLogger(__name__)

DEFAULT_PRESETS = [
    ("home", [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]),
    ("pick", [0.0, -45.0, 90.0, -45.0, 0.0, 0.0]),
    ("place", [90.0, -30.0, 60.0, -30.0, 0.0, 0.0]),
    ("inspect", [0.0, -90.0, 45.0, 0.0, 45.0, 0.0]),
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    with Session(engine) as session:
        for name, angles in DEFAULT_PRESETS:
            existing = session.get(Preset, None)
            from sqlmodel import select
            existing = session.exec(select(Preset).where(Preset.name == name)).first()
            if not existing:
                session.add(Preset(name=name, angles_json=json.dumps(angles)))
        session.commit()
    task = asyncio.create_task(motion_loop())
    logger.info("Motion engine started")
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass
    logger.info("Motion engine stopped")
