"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useStore } from "../lib/store";

function AnimatedValue({ value, label }: { value: number; label: string }) {
  const spring = useSpring(value, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => v.toFixed(3));

  return (
    <div className="flex flex-col items-center bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
      <span className="text-slate-500 text-[10px] font-mono uppercase mb-1">{label}</span>
      <motion.span className="text-sky-300 font-mono text-sm">{display}</motion.span>
      <span className="text-slate-600 text-[9px]">m</span>
    </div>
  );
}

export default function EndEffectorDisplay() {
  const ee = useStore((s) => s.endEffector);
  const gripper = useStore((s) => s.gripper);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        End-Effector Position
      </h2>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <AnimatedValue value={ee.x} label="X" />
        <AnimatedValue value={ee.y} label="Y" />
        <AnimatedValue value={ee.z} label="Z" />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-500 text-xs font-mono">Gripper</span>
        <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
            animate={{ width: `${gripper * 100}%` }}
            transition={{ type: "spring", stiffness: 80 }}
          />
        </div>
        <span className="text-slate-400 font-mono text-xs">{(gripper * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
