from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field


class JointCmd(BaseModel):
    type: Literal["joint_cmd"]
    joint: int = Field(ge=0, le=5)
    angle: float


class PresetCmd(BaseModel):
    type: Literal["preset_cmd"]
    name: str


class ArmFrame(BaseModel):
    joints: list[float]
    end_effector: dict[str, float]
    torques: list[float]
    gripper: float


class PresetCreate(BaseModel):
    name: str
    angles: list[float] = Field(min_length=6, max_length=6)


class PresetRead(BaseModel):
    id: int
    name: str
    angles: list[float]
    created_at: datetime


class IKRequest(BaseModel):
    x: float
    y: float
    z: float


class IKResponse(BaseModel):
    angles: list[float]
    reachable: bool


class HistoryEntryRead(BaseModel):
    id: int
    command_type: str
    payload_json: str
    created_at: datetime
