"use client";

import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const URL = `https://api.openweathermap.org/data/2.5/weather?q=Toronto,CA&appid=${API_KEY}&units=metric`;

export default function WeatherCard() {
  const [temp, setTemp] = useState(null);
  const [desc, setDesc] = useState(null);
  const [error, setError] = useState(false);

  async function fetchWeather() {
    try {
      const res = await fetch(URL);
      const data = await res.json();
      setTemp(data.main.temp.toFixed(1));
      setDesc(data.weather?.[0]?.description || "");
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 60 * 60 * 1000); // every hour
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 flex items-center gap-4">
      <span className="text-3xl">🌤️</span>
      <div>
        <p className="text-xs text-gray-500">Toronto Outdoor Temp</p>
        {error ? (
          <p className="text-sm text-red-400 mt-1">Failed to load</p>
        ) : (
          <>
            <p className="text-3xl font-bold text-yellow-400">
              {temp !== null ? `${temp} °C` : "--"}
            </p>
            {desc && <p className="text-xs text-gray-500 mt-0.5 capitalize">{desc}</p>}
          </>
        )}
        <p className="text-xs text-gray-600 mt-0.5">OpenWeather API · updates hourly</p>
      </div>
    </div>
  );
}
