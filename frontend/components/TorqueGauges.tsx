"use client";
import { motion } from "framer-motion";
import { useStore } from "../lib/store";

const COLORS = ["#38bdf8", "#818cf8", "#a78bfa", "#f472b6", "#fb923c", "#4ade80"];
const R = 22;
const CIRC = 2 * Math.PI * R;

export default function TorqueGauges() {
  const torques = useStore((s) => s.torques);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Joint Torque
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {torques.map((t, i) => {
          const pct = Math.min(1, t);
          const dash = pct * CIRC;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <svg width={56} height={56} viewBox="0 0 56 56">
                <circle cx={28} cy={28} r={R} fill="none" stroke="#1e293b" strokeWidth={5} />
                <motion.circle
                  cx={28}
                  cy={28}
                  r={R}
                  fill="none"
                  stroke={COLORS[i]}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={`${CIRC}`}
                  strokeDashoffset={CIRC - dash}
                  transform="rotate(-90 28 28)"
                  animate={{ strokeDashoffset: CIRC - dash }}
                  transition={{ type: "spring", stiffness: 80, damping: 18 }}
                />
                <text x={28} y={33} textAnchor="middle" fill={COLORS[i]} fontSize={11} fontFamily="monospace">
                  {(pct * 100).toFixed(0)}
                </text>
              </svg>
              <span className="text-[10px] text-slate-400 font-mono">J{i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
