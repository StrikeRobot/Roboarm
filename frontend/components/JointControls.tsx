"use client";
import { useStore } from "../lib/store";
import type { WsCommand } from "../types/roboarm";

const JOINT_LIMITS = [
  [-180, 180],
  [-90, 90],
  [-135, 135],
  [-180, 180],
  [-90, 90],
  [-180, 180],
];

const COLORS = ["sky", "indigo", "violet", "pink", "orange", "green"];

interface Props {
  sendCommand: (cmd: WsCommand) => void;
}

export default function JointControls({ sendCommand }: Props) {
  const joints = useStore((s) => s.joints);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Joint Controls
      </h2>
      <div className="space-y-3">
        {joints.map((val, i) => {
          const [lo, hi] = JOINT_LIMITS[i];
          const color = COLORS[i];
          return (
            <div key={i} className="flex items-center gap-3">
              <span className={`text-${color}-400 font-mono text-xs w-6`}>J{i + 1}</span>
              <input
                type="range"
                min={lo}
                max={hi}
                step={0.5}
                value={val}
                onChange={(e) =>
                  sendCommand({ type: "joint_cmd", joint: i, angle: parseFloat(e.target.value) })
                }
                className="flex-1 accent-sky-500 h-1.5 cursor-pointer"
              />
              <span className="text-slate-300 font-mono text-xs w-16 text-right">
                {val.toFixed(1)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
