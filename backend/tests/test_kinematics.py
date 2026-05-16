import math
import pytest
from app.services.kinematics import forward_kinematics, inverse_kinematics


def test_fk_home_position():
    angles = [0.0] * 6
    ee = forward_kinematics(angles)
    assert isinstance(ee["x"], float)
    assert isinstance(ee["z"], float)


def test_fk_nonzero():
    angles = [0.0, 45.0, 45.0, 0.0, 0.0, 0.0]
    ee = forward_kinematics(angles)
    assert ee["x"] != 0.0 or ee["z"] != 0.0


def test_ik_reachable():
    angles, reachable = inverse_kinematics(0.3, 0.0, 0.2)
    assert isinstance(angles, list)
    assert len(angles) == 6


def test_ik_unreachable_far():
    _, reachable = inverse_kinematics(10.0, 0.0, 10.0)
    assert not reachable


def test_fk_returns_all_keys():
    ee = forward_kinematics([0.0] * 6)
    assert "x" in ee and "y" in ee and "z" in ee
