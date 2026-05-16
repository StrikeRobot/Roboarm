"use client";
import { motion } from "framer-motion";
import { useStore } from "../lib/store";
import type { WsCommand } from "../types/roboarm";

const PRESET_ICONS: Record<string, string> = {
  home: "⌂",
  pick: "↓",
  place: "→",
  inspect: "◎",
};

interface Props {
  sendCommand: (cmd: WsCommand) => void;
}

export default function PresetPanel({ sendCommand }: Props) {
  const presets = useStore((s) => s.presets);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
        Preset Poses
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <motion.button
            key={preset.name}
            whileTap={{ scale: 0.93 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => sendCommand({ type: "preset_cmd", name: preset.name })}
            className="flex flex-col items-center gap-1 rounded-lg border border-slate-600 bg-slate-800 hover:border-sky-500 hover:bg-slate-700 p-3 transition-colors"
          >
            <span className="text-xl">{PRESET_ICONS[preset.name] ?? "◆"}</span>
            <span className="text-xs font-medium text-slate-200 capitalize">{preset.name}</span>
            <span className="text-[10px] text-slate-500 font-mono">
              [{preset.angles.map((a) => a.toFixed(0)).join(",")}]
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
