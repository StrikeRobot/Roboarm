from fastapi import APIRouter
from ..schemas import IKRequest, IKResponse
from ..services.kinematics import inverse_kinematics

router = APIRouter(prefix="/ik", tags=["kinematics"])


@router.post("/", response_model=IKResponse)
def compute_ik(body: IKRequest):
    angles, reachable = inverse_kinematics(body.x, body.y, body.z)
    return IKResponse(angles=angles, reachable=reachable)
