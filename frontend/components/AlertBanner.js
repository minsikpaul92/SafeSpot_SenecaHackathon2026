"use client";

/**
 * AlertBanner — shows a full-width warning banner based on temperature alert level.
 *
 * Props:
 *   alert — { level: "safe" | "caution" | "danger" | "extreme", message: string }
 *           Pass null/undefined to hide the banner.
 */
export default function AlertBanner({ alert }) {
  if (!alert || alert.level === "safe") return null;

  const styles = {
    caution: {
      bg: "bg-yellow-500",
      icon: "⚠️",
      label: "HEAT CAUTION",
    },
    danger: {
      bg: "bg-orange-600",
      icon: "🚨",
      label: "EXTREME HEAT WARNING",
    },
    extreme: {
      bg: "bg-red-600",
      icon: "🔴",
      label: "EXTREME DANGER",
    },
  };

  const s = styles[alert.level] ?? styles.caution;

  return (
    <div className={`fixed top-14 left-0 right-0 z-50 ${s.bg} text-white px-6 py-3 flex items-center justify-center gap-3 shadow-lg animate-pulse`}>
      <span className="text-xl">{s.icon}</span>
      <span className="font-bold tracking-wide text-sm uppercase">{s.label}</span>
      <span className="text-sm">—</span>
      <span className="text-sm">{alert.message}</span>
    </div>
  );
}
