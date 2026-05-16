import math
from .arm_state import LINK_LENGTHS, JOINT_LIMITS


def forward_kinematics(angles: list[float]) -> dict[str, float]:
    x, z = 0.0, 0.0
    cumulative = 0.0
    for i in range(1, 6):
        cumulative += math.radians(angles[i])
        x += LINK_LENGTHS[i] * math.cos(cumulative)
        z += LINK_LENGTHS[i] * math.sin(cumulative)
    y = LINK_LENGTHS[1] * math.sin(math.radians(angles[0]))
    return {"x": round(x, 4), "y": round(y, 4), "z": round(z, 4)}


def inverse_kinematics(
    target_x: float, target_y: float, target_z: float, iterations: int = 200
) -> tuple[list[float], bool]:
    angles = [0.0] * 6
    lr = 0.8
    for _ in range(iterations):
        ee = forward_kinematics(angles)
        err_x = target_x - ee["x"]
        err_z = target_z - ee["z"]
        err = math.hypot(err_x, err_z)
        if err < 1e-3:
            break
        for j in range(1, 5):
            angles[j] += lr * (err_x * math.cos(math.radians(angles[j]))
                                + err_z * math.sin(math.radians(angles[j])))
            lo, hi = JOINT_LIMITS[j]
            angles[j] = max(lo, min(hi, angles[j]))
        lr *= 0.998

    ee = forward_kinematics(angles)
    reachable = math.hypot(target_x - ee["x"], target_z - ee["z"]) < 0.05
    return [round(a, 2) for a in angles], reachable
