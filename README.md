<div align="center">

```
██████╗  ██████╗ ██████╗  ██████╗  █████╗ ██████╗ ███╗   ███╗
██╔══██╗██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗████╗ ████║
██████╔╝██║   ██║██████╔╝██║   ██║███████║██████╔╝██╔████╔██║
██╔══██╗██║   ██║██╔══██╗██║   ██║██╔══██║██╔══██╗██║╚██╔╝██║
██║  ██║╚██████╔╝██████╔╝╚██████╔╝██║  ██║██║  ██║██║ ╚═╝ ██║
╚═╝  ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝
```

**6-DOF Robotic Arm with Real-Time Bidirectional WebSocket Control**

<div>
<img src="docs/demo/roboarm-demo.gif" alt="RoboArm demo" width="760"/>
</div>

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-brightgreen)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

</div>

---

## Navigation

- [Demo](#demo)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Development](#development)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Demo

Real-time SVG arm visualization reacts to joint slider input with sub-50 ms
latency over a bidirectional WebSocket. Preset poses snap all six joints
simultaneously. Per-joint torque arc gauges and end-effector XYZ coordinates
update at 20 Hz directly from the motion engine.

---

## Features

- **Bidirectional WebSocket** — single persistent connection carries both
  outgoing commands and incoming telemetry frames at 20 Hz
- **6-DOF simulated arm** — joint limits enforced per axis; smooth
  interpolation (5°/tick) toward commanded targets
- **Forward & inverse kinematics** — FK computes real-time end-effector XYZ;
  IK REST endpoint accepts a target position and returns joint angles
- **Preset pose library** — Home / Pick / Place / Inspect stored in SQLite;
  custom presets via REST API
- **Movement history log** — last 100 commands persisted to database; clear via UI
- **Per-joint torque visualization** — six SVG arc gauges animated with Framer Motion
- **Docker-deployable** — single `docker compose up --build` brings the full stack

---

## Quick Start

```bash
git clone <repo-url>
cd 16th_may

cp .env.example .env   # edit if needed

docker compose up --build
```

| Service  | URL                        |
|----------|---------------------------|
| Frontend | http://localhost:3000      |
| API docs | http://localhost:8000/docs |
| Health   | http://localhost:8000/health |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Browser (Next.js 14)                   │
│  ┌──────────────┬────────────┬───────────┬───────────┐  │
│  │ ArmVisualizer│JointControl│TorqueGauge│EndEffector│  │
│  │  (SVG 2D)    │ (sliders)  │  (arcs)   │  (XYZ)    │  │
│  └──────┬───────┴─────┬──────┴─────┬─────┴─────┬─────┘  │
└─────────┼─────────────┼────────────┼───────────┼─────────┘
          │  [WS send]  │ [WS recv]  │  [REST]   │ [REST]
          │  joint_cmd  │ arm frames │  presets  │ history
          ▼             ▼            ▼           ▼
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Python 3.12)              │
│  ┌─────────────────────────────────────────────────┐    │
│  │ /ws/arm  ←── bidirectional WS ──►               │    │
│  │  routers: control · presets · history · ik      │    │
│  │  services: arm_state · kinematics · motion_engine│   │
│  └─────────────────────┬───────────────────────────┘    │
└────────────────────────┼────────────────────────────────┘
                         │
                  [SQLite  /data/roboarm.db]
```

### Motion Engine

The motion engine runs as an `asyncio` background task at 20 Hz.
Every tick it smooth-steps each joint's `current_angle` toward its
`target_angle` by at most 5°, then broadcasts the full arm frame as JSON to
all connected WebSocket clients. Commands from the client update `target_angle`
asynchronously — the engine handles the actual interpolation.

### WebSocket message format

**Client → Server**
```json
{ "type": "joint_cmd", "joint": 2, "angle": 45.0 }
{ "type": "preset_cmd", "name": "pick" }
```

**Server → Client** (20 Hz)
```json
{
  "joints": [0.0, -44.7, 89.3, -44.9, 0.0, 0.0],
  "end_effector": { "x": 0.312, "y": 0.0, "z": 0.187 },
  "torques": [0.0, 0.71, 0.58, 0.44, 0.12, 0.05],
  "gripper": 0.0
}
```

---

## Configuration

| Variable            | Default                        | Description                    |
|---------------------|-------------------------------|--------------------------------|
| `DATABASE_URL`      | `sqlite:////data/roboarm.db`  | SQLite connection string       |
| `CORS_ORIGINS`      | `http://localhost:3000`       | Allowed frontend origins       |
| `MOTION_HZ`         | `20`                          | Motion engine tick rate        |
| `MAX_DEG_PER_TICK`  | `5.0`                         | Max joint travel per tick (°)  |
| `HISTORY_LIMIT`     | `100`                         | Commands stored per GET        |

---

## Development

### Backend

```bash
cd backend
uv venv && source .venv/bin/activate
uv pip install -e .
uvicorn app.main:app --reload
```

Run tests:
```bash
pytest tests/ -v
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

---

## Tech Stack

| Layer      | Technology                                   |
|------------|---------------------------------------------|
| Backend    | Python 3.12 · FastAPI · SQLModel · uvicorn  |
| Database   | SQLite (via SQLModel ORM)                   |
| Frontend   | Next.js 14 · TypeScript 5 · Tailwind CSS 3  |
| State      | Zustand 4                                   |
| Animation  | Framer Motion 11                            |
| Protocol   | WebSocket (bidirectional) + REST            |
| Container  | Docker + Docker Compose v2                  |

---

## License

[MIT](LICENSE) © 2024 Strike Robot
