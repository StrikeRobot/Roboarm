"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../lib/store";
import { api } from "../lib/api";

export default function MovementHistory() {
  const history = useStore((s) => s.history);
  const setHistory = useStore((s) => s.setHistory);

  useEffect(() => {
    api.history.list().then(setHistory).catch(() => {});
  }, [setHistory]);

  const handleClear = async () => {
    await api.history.clear();
    setHistory([]);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Movement Log
        </h2>
        <button
          onClick={handleClear}
          className="text-[10px] text-slate-500 hover:text-red-400 transition-colors font-mono"
        >
          clear
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1 max-h-48">
        <AnimatePresence initial={false}>
          {history.slice(0, 30).map((entry) => {
            let label = "";
            try {
              const p = JSON.parse(entry.payload_json);
              if (entry.command_type === "joint_cmd") {
                label = `J${p.joint + 1} → ${p.angle.toFixed(1)}°`;
              } else {
                label = `preset: ${p.name}`;
              }
            } catch {
              label = entry.command_type;
            }
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-[11px] font-mono"
              >
                <span className="text-slate-600">
                  {new Date(entry.created_at).toLocaleTimeString()}
                </span>
                <span
                  className={
                    entry.command_type === "preset_cmd"
                      ? "text-violet-400"
                      : "text-sky-400"
                  }
                >
                  {label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {history.length === 0 && (
          <p className="text-slate-600 text-xs font-mono">no commands yet</p>
        )}
      </div>
    </div>
  );
}
