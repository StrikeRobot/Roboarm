import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RoboArm — Real-Time Arm Control",
  description: "6-DOF robotic arm dashboard with real-time WebSocket control",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0f1e] text-slate-200 antialiased">{children}</body>
    </html>
  );
}
