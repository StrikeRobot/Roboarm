import { create } from "zustand";
import type { ArmFrame, Preset, HistoryEntry } from "../types/roboarm";

interface ArmStore {
  connected: boolean;
  joints: number[];
  endEffector: { x: number; y: number; z: number };
  torques: number[];
  gripper: number;
  presets: Preset[];
  history: HistoryEntry[];
  setConnected: (v: boolean) => void;
  setFrame: (f: ArmFrame) => void;
  setPresets: (p: Preset[]) => void;
  setHistory: (h: HistoryEntry[]) => void;
}

export const useStore = create<ArmStore>((set) => ({
  connected: false,
  joints: [0, 0, 0, 0, 0, 0],
  endEffector: { x: 0, y: 0, z: 0 },
  torques: [0, 0, 0, 0, 0, 0],
  gripper: 0,
  presets: [],
  history: [],
  setConnected: (v) => set({ connected: v }),
  setFrame: (f) =>
    set({
      joints: f.joints,
      endEffector: f.end_effector,
      torques: f.torques,
      gripper: f.gripper,
    }),
  setPresets: (p) => set({ presets: p }),
  setHistory: (h) => set({ history: h }),
}));
