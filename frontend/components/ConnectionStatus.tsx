"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../lib/store";

export default function ConnectionStatus() {
  const connected = useStore((s) => s.connected);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={connected ? "on" : "off"}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={`flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full border ${
          connected
            ? "border-emerald-700 bg-emerald-900/30 text-emerald-400"
            : "border-red-800 bg-red-900/20 text-red-400"
        }`}
      >
        <motion.span
          className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400" : "bg-red-500"}`}
          animate={connected ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        {connected ? "connected" : "disconnected"}
      </motion.div>
    </AnimatePresence>
  );
}
