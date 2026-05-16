from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .events import lifespan
from .routers import control, presets, history, kinematics

app = FastAPI(title="RoboArm API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(control.router)
app.include_router(presets.router)
app.include_router(history.router)
app.include_router(kinematics.router)


@app.get("/health")
def health():
    return {"status": "ok"}
