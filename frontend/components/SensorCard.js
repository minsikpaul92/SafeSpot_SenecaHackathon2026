"use client";

import { useEffect, useRef, useState } from "react";
import AlertBanner from "./AlertBanner";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function getAlertLevel(temp) {
  if (temp === null) return null;
  if (temp >= 40) return { level: "extreme", message: "Seek cooling immediately — dangerous heat levels detected" };
  if (temp >= 35) return { level: "danger",  message: "Find a Cool Space Now — cooling centres and libraries are open" };
  if (temp >= 30) return { level: "caution", message: "Stay hydrated and seek shade" };
  return { level: "safe", message: "" };
}

/** Web Audio API — siren-style alarm */
function playAlarmSound(level) {
  try {
    const ctx = new AudioContext();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";

    if (level === "extreme") {
      // Fast wailing siren — volume reduced
      gain.gain.setValueAtTime(0.25, t);
      for (let i = 0; i < 4; i++) {
        osc.frequency.setValueAtTime(600,  t + i * 0.5);
        osc.frequency.linearRampToValueAtTime(1400, t + i * 0.5 + 0.25);
        osc.frequency.linearRampToValueAtTime(600,  t + i * 0.5 + 0.5);
      }
      gain.gain.setValueAtTime(0.25, t + 1.9);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
      osc.start(t);
      osc.stop(t + 2.0);

    } else if (level === "danger") {
      // Slower siren — volume reduced
      gain.gain.setValueAtTime(0.25, t);
      for (let i = 0; i < 2; i++) {
        osc.frequency.setValueAtTime(500,  t + i * 0.8);
        osc.frequency.linearRampToValueAtTime(1100, t + i * 0.8 + 0.4);
        osc.frequency.linearRampToValueAtTime(500,  t + i * 0.8 + 0.8);
      }
      gain.gain.setValueAtTime(0.25, t + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      osc.start(t);
      osc.stop(t + 1.6);

    } else {
      // Caution — 도도도도 (pause) 도도도도, sine wave, louder
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, t);
      const beepDur = 0.12;
      const gap     = 0.15;
      const groupGap = 0.35;
      // Group 1: 4 beeps
      for (let i = 0; i < 4; i++) {
        const s = t + i * (beepDur + gap);
        gain.gain.setValueAtTime(0.45, s);
        gain.gain.setValueAtTime(0.45, s + beepDur);
        gain.gain.setValueAtTime(0,    s + beepDur + 0.01);
      }
      // Group 2: 4 beeps (after pause)
      const offset = 4 * (beepDur + gap) + groupGap;
      for (let i = 0; i < 4; i++) {
        const s = t + offset + i * (beepDur + gap);
        gain.gain.setValueAtTime(0.45, s);
        gain.gain.setValueAtTime(0.45, s + beepDur);
        gain.gain.setValueAtTime(0,    s + beepDur + 0.01);
      }
      gain.gain.setValueAtTime(0, t);  // start silent
      osc.start(t);
      osc.stop(t + offset + 4 * (beepDur + gap));
    }
  } catch {
    // AudioContext blocked — silent fail
  }
}

/** Browser / OS push notification — call after permission already granted */
function showPushNotification(alert) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const titles = {
    extreme: "🔴 EXTREME DANGER — SafeSpot",
    danger:  "🚨 Extreme Heat Warning — SafeSpot",
    caution: "⚠️ Heat Caution — SafeSpot",
  };

  new Notification(titles[alert.level] ?? "SafeSpot Alert", {
    body: alert.message,
    icon: "/user-pin.svg",
    tag:  "safespot-heat-alert",
    requireInteraction: alert.level === "extreme",
  });
}

export default function SensorCard() {
  const [temp, setTemp] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [connected, setConnected] = useState(false);
  const prevLevel = useRef(null);  // track previous level to avoid re-triggering

  // Request notification permission on mount (needs to happen before alert fires)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
        }
      } catch {
        setConnected(false);
      }
    }

    fetchSensor();
    const interval = setInterval(fetchSensor, 5000);

    function handleOverride(e) {
      setTemp(e.detail.temperature);
      setTimestamp(new Date().toISOString());
      setConnected(true);
    }
    window.addEventListener("safespot-temp-override", handleOverride);

    return () => {
      clearInterval(interval);
      window.removeEventListener("safespot-temp-override", handleOverride);
    };
  }, []);

  const alert = getAlertLevel(temp);

  // Trigger sound + push notification when alert level escalates
  useEffect(() => {
    const level = alert?.level;
    if (!level || level === "safe") {
      prevLevel.current = level;
      return;
    }
    if (level === prevLevel.current) return;  // same level, don't retrigger
    prevLevel.current = level;

    playAlarmSound(level);
    showPushNotification(alert);
  }, [alert?.level]);

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
