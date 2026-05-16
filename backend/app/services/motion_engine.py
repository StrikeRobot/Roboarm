import asyncio
import json
import logging
from fastapi import WebSocket
from .arm_state import arm
from ..config import settings

logger = logging.getLogger(__name__)

_connections: set[WebSocket] = set()


def register(ws: WebSocket) -> None:
    _connections.add(ws)


def unregister(ws: WebSocket) -> None:
    _connections.discard(ws)


async def broadcast(frame: dict) -> None:
    dead = set()
    for ws in _connections:
        try:
            await ws.send_json(frame)
        except Exception:
            dead.add(ws)
    _connections.difference_update(dead)


async def motion_loop() -> None:
    interval = 1.0 / settings.motion_hz
    while True:
        await arm.step(settings.max_deg_per_tick)
        frame = arm.snapshot()
        await broadcast(frame)
        await asyncio.sleep(interval)
