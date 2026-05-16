import asyncio
import math
from dataclasses import dataclass, field

JOINT_LIMITS: list[tuple[float, float]] = [
    (-180.0, 180.0),
    (-90.0, 90.0),
    (-135.0, 135.0),
    (-180.0, 180.0),
    (-90.0, 90.0),
    (-180.0, 180.0),
]

LINK_LENGTHS = [0.0, 0.26, 0.22, 0.18, 0.12, 0.08]


@dataclass
class ArmState:
    current_angles: list[float] = field(default_factory=lambda: [0.0] * 6)
    target_angles: list[float] = field(default_factory=lambda: [0.0] * 6)
    gripper: float = 0.0
    _lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    def clamp_angle(self, joint: int, angle: float) -> float:
        lo, hi = JOINT_LIMITS[joint]
        return max(lo, min(hi, angle))

    async def set_joint_target(self, joint: int, angle: float) -> None:
        async with self._lock:
            self.target_angles[joint] = self.clamp_angle(joint, angle)

    async def set_preset(self, angles: list[float]) -> None:
        async with self._lock:
            for i, a in enumerate(angles[:6]):
                self.target_angles[i] = self.clamp_angle(i, a)

    async def step(self, max_deg: float) -> None:
        async with self._lock:
            for i in range(6):
                diff = self.target_angles[i] - self.current_angles[i]
                step = max(-max_deg, min(max_deg, diff))
                self.current_angles[i] += step

    def torques(self) -> list[float]:
        torques = []
        for i, a in enumerate(self.current_angles):
            base = abs(math.sin(math.radians(a))) * (1.0 - i * 0.12)
            torques.append(round(max(0.0, base + 0.05 * math.cos(i)), 3))
        return torques

    def end_effector(self) -> dict[str, float]:
        x, y, z = 0.0, 0.0, 0.0
        cumulative = 0.0
        for i in range(1, 6):
            cumulative += math.radians(self.current_angles[i])
            x += LINK_LENGTHS[i] * math.cos(cumulative)
            z += LINK_LENGTHS[i] * math.sin(cumulative)
        y = LINK_LENGTHS[1] * math.sin(math.radians(self.current_angles[0]))
        return {"x": round(x, 4), "y": round(y, 4), "z": round(z, 4)}

    def snapshot(self) -> dict:
        return {
            "joints": [round(a, 3) for a in self.current_angles],
            "end_effector": self.end_effector(),
            "torques": self.torques(),
            "gripper": self.gripper,
        }


arm = ArmState()
