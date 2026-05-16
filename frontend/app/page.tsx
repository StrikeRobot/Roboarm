"use client";
import { useEffect } from "react";
import { useArmWS } from "../lib/ws";
import { useStore } from "../lib/store";
import { api } from "../lib/api";
import ArmVisualizer from "../components/ArmVisualizer";
import JointControls from "../components/JointControls";
import PresetPanel from "../components/PresetPanel";
import TorqueGauges from "../components/TorqueGauges";
import EndEffectorDisplay from "../components/EndEffectorDisplay";
import MovementHistory from "../components/MovementHistory";
import ConnectionStatus from "../components/ConnectionStatus";

export default function HomePage() {
  const { sendCommand } = useArmWS();
  const setPresets = useStore((s) => s.setPresets);

  useEffect(() => {
    api.presets.list().then(setPresets).catch(() => {});
  }, [setPresets]);

  return (
    <main className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">
            <span className="text-sky-400">Robo</span>Arm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">6-DOF Real-Time Control Dashboard</p>
        </div>
        <ConnectionStatus />
      </header>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — visualizer */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <ArmVisualizer />
          <EndEffectorDisplay />
        </div>

        {/* Centre — controls */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <JointControls sendCommand={sendCommand} />
          <PresetPanel sendCommand={sendCommand} />
        </div>

        {/* Right — telemetry + log */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <TorqueGauges />
          <MovementHistory />
        </div>
      </div>
    </main>
  );
}
