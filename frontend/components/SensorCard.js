"use client";

import { useEffect, useState } from "react";
import AlertBanner from "./AlertBanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function getAlertLevel(temp) {
  if (temp === null) return null;
  if (temp >= 40) return { level: "extreme", message: "Seek cooling immediately — dangerous heat levels detected" };
  if (temp >= 35) return { level: "danger",  message: "Find a Cool Space Now — cooling centres and libraries are open" };
  if (temp >= 30) return { level: "caution", message: "Stay hydrated and seek shade" };
  return { level: "safe", message: "" };
}

export default function SensorCard() {
  const [temp, setTemp] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    async function fetchSensor() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/sensor-latest`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.temperature !== undefined && data.temperature !== null) {
          setTemp(data.temperature);
          setTimestamp(data.timestamp);
          setConnected(true);
          // Use server-side alert if available, else compute locally
        }
      } catch {
        setConnected(false);
      }
    }

    fetchSensor();
    const interval = setInterval(fetchSensor, 5000);
    return () => clearInterval(interval);
  }, []);

  const alert = getAlertLevel(temp);
  const barPercent = temp !== null ? Math.min(100, Math.max(0, ((temp - 15) / (45 - 15)) * 100)) : 0;
  const barColor = temp >= 40 ? "bg-red-600" : temp >= 35 ? "bg-orange-500" : temp >= 30 ? "bg-yellow-400" : "bg-green-400";

  return (
    <>
      <AlertBanner alert={alert} />

      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 flex items-center gap-4">
        <span className="text-3xl">🌡️</span>
        <div className="flex-1">
          <p className="text-xs text-gray-500">Sensor Temperature</p>
          <p className="text-3xl font-bold text-orange-400">
            {temp !== null ? `${temp} °C` : "--"}
          </p>
          {/* Temperature bar */}
          <div className="mt-2 h-1.5 bg-zinc-700 rounded-full w-full">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${barPercent}%` }}
            />
          </div>
          <p className="text-xs mt-1 text-gray-600">
            {connected
              ? `Raspberry Pi · ${timestamp ? new Date(timestamp).toLocaleTimeString() : "live"}`
              : "Waiting for Raspberry Pi connection…"}
          </p>
        </div>
      </div>
    </>
  );
}
