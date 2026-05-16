"use client";
import { motion } from "framer-motion";
import { useStore } from "../lib/store";

const LINK_LENGTHS = [0, 80, 68, 54, 36, 24]; // px, proportional to physical
const JOINT_COLORS = ["#38bdf8", "#818cf8", "#a78bfa", "#f472b6", "#fb923c", "#4ade80"];
const JOINT_RADIUS = 8;

export default function ArmVisualizer() {
  const joints = useStore((s) => s.joints);

  let cx = 220;
  let cy = 340;
  let cumAngle = -Math.PI / 2;

  const segments: { x1: number; y1: number; x2: number; y2: number; color: string }[] = [];
  const circles: { cx: number; cy: number; color: string; label: string }[] = [];

  circles.push({ cx, cy, color: JOINT_COLORS[0], label: "J1" });

  for (let i = 1; i < 6; i++) {
    cumAngle += (joints[i] * Math.PI) / 180;
    const x2 = cx + LINK_LENGTHS[i] * Math.cos(cumAngle);
    const y2 = cy + LINK_LENGTHS[i] * Math.sin(cumAngle);
    segments.push({ x1: cx, y1: cy, x2, y2, color: JOINT_COLORS[i - 1] });
    circles.push({ cx: x2, cy: y2, color: JOINT_COLORS[i], label: `J${i + 1}` });
    cx = x2;
    cy = y2;
  }

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col items-center">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Arm View
      </h2>
      <svg width="440" height="380" className="overflow-visible">
        {/* Base */}
        <rect x={170} y={348} width={100} height={18} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />

        {/* Links */}
        {segments.map((s, i) => (
          <motion.line
            key={i}
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke={s.color}
            strokeWidth={6}
            strokeLinecap="round"
            initial={false}
            animate={{ x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        ))}

        {/* Joints */}
        {circles.map((c, i) => (
          <g key={i}>
            <circle cx={c.cx} cy={c.cy} r={JOINT_RADIUS + 3} fill="#0f172a" stroke={c.color} strokeWidth={2} />
            <circle cx={c.cx} cy={c.cy} r={JOINT_RADIUS - 2} fill={c.color} opacity={0.85} />
            <text x={c.cx + 14} y={c.cy + 4} fill={c.color} fontSize="10" fontFamily="monospace">
              {c.label}
            </text>
          </g>
        ))}

        {/* End-effector indicator */}
        <motion.circle
          cx={circles[5].cx}
          cy={circles[5].cy}
          r={5}
          fill="none"
          stroke="#f0f9ff"
          strokeWidth={1.5}
          strokeDasharray="3 2"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </svg>
    </div>
  );
}
