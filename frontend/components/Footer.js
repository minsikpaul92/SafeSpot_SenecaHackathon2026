export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 px-8 py-12 text-center text-gray-500 bg-black">
      <p className="text-white font-semibold text-lg mb-1">🌡️ SafeSpot Toronto</p>
      <p className="text-sm mb-6">Real-time heat risk mapping & cooling centre routing</p>

      <div className="flex justify-center gap-2 flex-wrap text-sm mb-6">
        {["Gary — Hardware", "Marcos — Backend", "Paul — Frontend", "Seulgi — UI/UX", "Arun — GPS & Routing"].map((member) => (
          <span key={member} className="bg-zinc-900 border border-zinc-700 rounded-full px-4 py-1">
            {member}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-700">
        Built for Seneca Polytechnic Hackathon 2026 · Theme 3: Community Energy, Equity and Sustainability
      </p>
    </footer>
  );
}
