import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── SECTION 1: USER STORY ── */}
        <section id="story" className="min-h-screen flex flex-col justify-center items-center px-8 py-32 text-center">
          <p className="text-sm uppercase tracking-widest text-orange-400 mb-4">Why SafeSpot?</p>
          <h1 className="text-5xl font-bold mb-8 leading-tight max-w-3xl">
            In 2021, a deadly heatwave killed hundreds in Vancouver.
          </h1>
          <p className="text-gray-400 max-w-xl text-lg mb-4">
            [기사 링크 들어갈 자리 — Vancouver heat dome, June 2021]
          </p>
          <p className="text-gray-300 max-w-2xl text-xl mb-6">
            많은 희생자들은 근처에 쿨링센터가 있었지만 그 사실을 몰랐습니다.
            실시간으로 폭염을 감지하고, GPS 기반으로 가장 가까운 공공시설을 신속하게 안내했다면
            더 많은 생명을 구할 수 있었을 것입니다.
          </p>
          <p className="text-orange-400 text-lg font-medium">
            SafeSpot은 실시간 온도 감지 + GPS 기반 쿨링센터 알람 시스템입니다.
          </p>
        </section>

        {/* ── SECTION 2: ACTIVITY DIAGRAM ── */}
        <section id="how-it-works" className="min-h-screen flex flex-col justify-center items-center px-8 py-32 bg-zinc-950">
          <p className="text-sm uppercase tracking-widest text-orange-400 mb-4">How It Works</p>
          <h2 className="text-4xl font-bold mb-16">시스템 흐름도</h2>

          {/* 플레이스홀더 — 나중에 스크롤 연동 애니메이션 다이어그램으로 교체 */}
          <div className="flex flex-col items-center gap-0 w-full max-w-sm">
            {[
              { icon: "🌡️", label: "라즈베리파이 온도 감지", sub: "Raspberry Pi Temperature Sensor" },
              { icon: "📍", label: "GPS로 위치 파악", sub: "Browser GPS Location API" },
              { icon: "🚨", label: "폭염 알람 발송", sub: "Threshold Alert (35°C+)" },
              { icon: "🏛️", label: "가장 가까운 쿨링센터 안내", sub: "Nearest Cooling Centre Routing" },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center w-full">
                <div className="border border-zinc-700 rounded-2xl px-8 py-5 text-center bg-zinc-900 w-full">
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <div className="font-semibold text-white">{step.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{step.sub}</div>
                </div>
                {i < 3 && <div className="text-gray-600 text-2xl my-1">↓</div>}
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 3: MAP LAYERS ── */}
        <section id="map-layers" className="min-h-screen flex flex-col justify-center items-center px-8 py-32">
          <p className="text-sm uppercase tracking-widest text-orange-400 mb-4">Data Layers</p>
          <h2 className="text-4xl font-bold mb-4">지도 데이터 레이어</h2>
          <p className="text-gray-400 mb-16">4개의 레이어가 쌓이며 토론토의 열 위험 지도를 구성합니다</p>

          {/* 플레이스홀더 — 나중에 스크롤 연동 레이어 스택 애니메이션으로 교체 */}
          <div className="flex flex-col gap-4 w-full max-w-lg">
            {[
              { num: "01", label: "Toronto Base Map",            desc: "토론토 기본 지도 (Leaflet + OpenStreetMap)",        color: "border-blue-800" },
              { num: "02", label: "Urban Heat Island Effect",    desc: "도시 열섬 효과 — ArcGIS REST API (Seneca)",        color: "border-orange-800" },
              { num: "03", label: "Air Conditioned & Cool Spaces", desc: "냉방 공간 위치 — City of Toronto Open Data",    color: "border-cyan-800" },
              { num: "04", label: "Library Branch Locations",   desc: "도서관 위치 — City of Toronto Open Data",          color: "border-green-800" },
            ].map((layer, i) => (
              <div key={i} className={`border ${layer.color} rounded-xl px-6 py-4 bg-zinc-900 flex items-center gap-4`}>
                <span className="text-2xl font-bold text-gray-600 w-10">{layer.num}</span>
                <div>
                  <div className="font-semibold text-white">{layer.label}</div>
                  <div className="text-sm text-gray-500">{layer.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 w-full max-w-lg h-72 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center text-gray-600">
            [ Leaflet 지도 들어갈 자리 ]
          </div>
        </section>

        {/* ── SECTION 4: LIVE DASHBOARD ── */}
        <section id="dashboard" className="min-h-screen flex flex-col justify-center items-center px-8 py-32 bg-zinc-950">
          <p className="text-sm uppercase tracking-widest text-orange-400 mb-4">Live Dashboard</p>
          <h2 className="text-4xl font-bold mb-4">실시간 대시보드</h2>
          <p className="text-gray-400 mb-16">라즈베리파이 센서 + GPS가 결합되어 실시간으로 동작합니다</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
            {/* 온도 카드 */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-2">🌡️ Live Temperature</p>
              <div className="text-5xl font-bold text-orange-400">-- °C</div>
              <p className="text-xs text-gray-600 mt-3">Raspberry Pi 센서에서 받아오는 실시간 온도</p>
              <div className="mt-4 h-2 bg-zinc-800 rounded-full">
                <div className="h-2 w-0 bg-orange-400 rounded-full" />
              </div>
            </div>

            {/* GPS 카드 */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6">
              <p className="text-sm text-gray-500 mb-2">📍 Your Location</p>
              <div className="text-2xl font-bold text-cyan-400">-- , --</div>
              <p className="text-xs text-gray-500 mt-1">Lat / Lng</p>
              <p className="text-xs text-gray-600 mt-3">브라우저 GPS로 감지되는 실시간 위치</p>
              <div className="mt-4 text-gray-700 text-sm">[ GPS 권한 요청 버튼 들어갈 자리 ]</div>
            </div>
          </div>

          {/* 통합 지도 */}
          <div className="w-full max-w-3xl h-80 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-600">
            <span className="text-3xl">🗺️</span>
            <span>[ 실시간 통합 지도 — 쿨링센터 + 도서관 마커 + 내 위치 ]</span>
            <span className="text-sm text-gray-700">온도 35°C 초과 시 알람 배너 표시</span>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
