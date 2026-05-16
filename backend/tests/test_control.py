import pytest
from app.services.arm_state import ArmState


@pytest.mark.asyncio
async def test_set_joint_target_clamps():
    state = ArmState()
    await state.set_joint_target(0, 999.0)
    assert state.target_angles[0] == 180.0


@pytest.mark.asyncio
async def test_set_joint_target_negative_clamp():
    state = ArmState()
    await state.set_joint_target(1, -999.0)
    assert state.target_angles[1] == -90.0


@pytest.mark.asyncio
async def test_step_moves_toward_target():
    state = ArmState()
    state.target_angles[0] = 30.0
    await state.step(5.0)
    assert state.current_angles[0] == 5.0


@pytest.mark.asyncio
async def test_snapshot_keys():
    state = ArmState()
    snap = state.snapshot()
    assert "joints" in snap
    assert "end_effector" in snap
    assert "torques" in snap
    assert len(snap["joints"]) == 6


@pytest.mark.asyncio
async def test_set_preset():
    state = ArmState()
    angles = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0]
    await state.set_preset(angles)
    assert state.target_angles == angles
