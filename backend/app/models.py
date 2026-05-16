import json
from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class Preset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    angles_json: str  # JSON array of 6 floats
    created_at: datetime = Field(default_factory=datetime.utcnow)

    @property
    def angles(self) -> list[float]:
        return json.loads(self.angles_json)


class HistoryEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    command_type: str  # "joint_cmd" | "preset_cmd"
    payload_json: str  # raw command payload
    created_at: datetime = Field(default_factory=datetime.utcnow)
