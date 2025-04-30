import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreditDisplay from "./CreditDisplay";
import PointsDisplay from "./PointsDisplay";
import BuyCreditsButton from "./BuyCreditsButton";
import { Link } from "react-router-dom";

export default function Layout({
  children,
  creditsRefreshKey,
  pointsRefreshKey,
  onBuyCreditsSuccess,
}) {
  return (
    <div className="relative bg-gameboyFade min-h-screen w-full overflow-hidden text-white">
      {/* Scanline overlay */}
      <div className="absolute inset-0 bg-scanlines bg-repeat opacity-50 mix-blend-soft-light pointer-events-none z-20 animate-scanlineDrift" />

      {/* Back to games and Connect buttons*/}
      <header className="w-full px-4 py-3 flex justify-between items-center z-40">
        <Link to="/">
          <button className="px-4 py-2 font-ibm bg-gameboy text-gameboyDark rounded hover:bg-gameboyMedium shadow">
            ← Back to games
          </button>
        </Link>

        <ConnectButton />
      </header>

      {/* Shared wallet UI */}
      <div className="relative z-30 flex justify-center mt-0 mb-6 px-4">
        <div className="border-1 border-gameboyButton p-4 rounded-xl shadow-[0_2px_6px_#8bac0f80] w-full max-w-sm text-center flex flex-col items-center gap-3 backdrop-blur-sm bg-white/5">
          <div className="flex gap-4 justify-center w-full">
            <CreditDisplay refreshTrigger={creditsRefreshKey} />
            <PointsDisplay refreshTrigger={pointsRefreshKey} />
          </div>
          <BuyCreditsButton onSuccess={onBuyCreditsSuccess} />
        </div>
      </div>

      <main className="relative z-10 px-4 py-6 flex justify-center pb-10 min-h-[50vh]">
        {children}
      </main>
    </div>
  );
}