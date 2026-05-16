import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlmodel import Session
from ..db import engine
from ..models import HistoryEntry
from ..schemas import JointCmd, PresetCmd
from ..services import arm_state as arm_svc
from ..services import motion_engine
from sqlmodel import select

router = APIRouter()
logger = logging.getLogger(__name__)


@router.websocket("/ws/arm")
async def arm_ws(websocket: WebSocket):
    await websocket.accept()
    motion_engine.register(websocket)
    await websocket.send_json(arm_svc.arm.snapshot())
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                data = json.loads(raw)
            except json.JSONDecodeError:
                continue

            cmd_type = data.get("type")
            if cmd_type == "joint_cmd":
                cmd = JointCmd(**data)
                await arm_svc.arm.set_joint_target(cmd.joint, cmd.angle)
                _log_history("joint_cmd", data)
            elif cmd_type == "preset_cmd":
                cmd = PresetCmd(**data)
                from sqlmodel import select as sq
                with Session(engine) as session:
                    from ..models import Preset
                    preset = session.exec(sq(Preset).where(Preset.name == cmd.name)).first()
                if preset:
                    await arm_svc.arm.set_preset(preset.angles)
                    _log_history("preset_cmd", data)
    except WebSocketDisconnect:
        pass
    finally:
        motion_engine.unregister(websocket)


def _log_history(cmd_type: str, payload: dict) -> None:
    with Session(engine) as session:
        session.add(HistoryEntry(command_type=cmd_type, payload_json=json.dumps(payload)))
        session.commit()
