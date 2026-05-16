const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const api = {
  presets: {
    list: () => req<import("../types/roboarm").Preset[]>("/presets/"),
    create: (name: string, angles: number[]) =>
      req("/presets/", {
        method: "POST",
        body: JSON.stringify({ name, angles }),
      }),
    delete: (name: string) =>
      req(`/presets/${name}`, { method: "DELETE" }),
  },
  history: {
    list: () => req<import("../types/roboarm").HistoryEntry[]>("/history/"),
    clear: () => req("/history/", { method: "DELETE" }),
  },
  ik: (x: number, y: number, z: number) =>
    req<{ angles: number[]; reachable: boolean }>("/ik/", {
      method: "POST",
      body: JSON.stringify({ x, y, z }),
    }),
};
