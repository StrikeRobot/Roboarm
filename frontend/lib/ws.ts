"use client";
import { useEffect, useRef, useCallback } from "react";
import { useStore } from "./store";
import type { WsCommand } from "../types/roboarm";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/arm";

export function useArmWS() {
  const wsRef = useRef<WebSocket | null>(null);
  const { setConnected, setFrame } = useStore();

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      setTimeout(connect, 2000);
    };
    ws.onerror = () => ws.close();
    ws.onmessage = (ev) => {
      try {
        const frame = JSON.parse(ev.data);
        setFrame(frame);
      } catch {}
    };
  }, [setConnected, setFrame]);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  const sendCommand = useCallback((cmd: WsCommand) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(cmd));
    }
  }, []);

  return { sendCommand };
}
