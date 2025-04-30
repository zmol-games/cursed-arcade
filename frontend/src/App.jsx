import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreditDisplay from "./components/CreditDisplay";
import PointsDisplay from "./components/PointsDisplay";
import BuyCreditsButton from "./components/BuyCreditsButton";
import SlotMachine from "./pages/SlotMachine";
import TicTacToad from "./pages/TicTacToad";
import BlobPaperScissors from "./pages/BlobPaperScissors";
import AdminWithdrawButton from "./components/AdminWithdrawButton";
import FaucetButton from "./components/FaucetButton";

function Home() {
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0);
  const [account, setAccount] = useState(null);
  const [walletAvailable, setWalletAvailable] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) {
      setWalletAvailable(false);
      return;
    }

    setWalletAvailable(true); // ✅ Wallet *is* available (installed)

    async function checkAccounts() {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setAccount(accounts[0] || null);

        const handleAccountsChanged = (accs) => {
          setAccount(accs[0] || null);
        };

        window.ethereum.on("accountsChanged", handleAccountsChanged);

        return () => {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged,
          );
        };
      } catch (err) {
        console.error("Error checking wallet:", err);
      }
    }

    checkAccounts();
  }, []);

  if (!walletAvailable) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center text-white p-8">
        <h1 className="text-4xl font-gameboy mb-4">Zmol Games</h1>
        <p className="text-gameboyButton font-vt">
          If you're on mobile, please open zmol.games in a Web3 wallet dapp
          browser like MetaMask or Coinbase Wallet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden min-h-screen p-8 text-center text-white bg-gameboyFade">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-scanlines bg-repeat opacity-50 mix-blend-soft-light pointer-events-none z-20 animate-scanlineDrift" />

      {/* Main content container */}
      <div className="relative z-10">
        {/* Header wrapper */}
        <div className="relative w-full mb-8">
          {/* Connect button in top-right */}
          <div className="absolute top-0 right-0">
            <ConnectButton />
          </div>

          {/* Centered heading + subtitle */}
          <div className="pt-12 flex flex-col items-center justify-center text-center">
            <h1 className="font-gameboy leading-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gameboyDark animate-flicker">
              Zmol Games
            </h1>
            <p className="font-ibm text-gameboyButton text-lg sm:text-xl md:text-2xl mt-2">
              Dumb. Onchain.
            </p>
          </div>
        </div>

        {/* Wallet Stats */}
        <div className="mt-12 flex justify-center gap-4 items-center">
          <CreditDisplay refreshTrigger={creditsRefreshKey} />
          <PointsDisplay refreshTrigger={creditsRefreshKey} />
        </div>

        {/* Buy credits */}
        <h2 className="mt-8 font-vt text-2xl sm:text-2xl md:text-3xl text-gameboyDark mb-2">
          0.003 ETH for 10 credits
        </h2>
        <div className="mt-2">
          <BuyCreditsButton
            onSuccess={() => setCreditsRefreshKey((k) => k + 1)}
          />
        </div>

        <div className="mt-4">
          <FaucetButton onSuccess={() => setCreditsRefreshKey((k) => k + 1)} />
        </div>

        <h2 className="mt-8 sm:mt-12 mb-4 font-vt text-4xl sm:text-5xl md:text-6xl text-gameboyMedium tracking-wide opacity-80 animate-ghost text-center">
          — the cursed arcade —
        </h2>

        {/* Game links */}
        <div className="mt-6 sm:mt-10 mb-8 flex flex-col lg:flex-row justify-center items-center gap-6 flex-wrap">
          <Link to="/slot-machine">
            <div className="bg-gameboy border-4 border-gameboyDark rounded-none p-2 hover:brightness-110 transition inline-flex items-center gap-2">
              <img
                src="/images/slot-image.png"
                alt="Slot"
                className="w-8 h-8"
              />
              <img
                src="/images/slotmachinebutton.png"
                alt="Play Slot Machine"
                className="h-10"
              />
            </div>
          </Link>

          <Link to="/tictactoad" className="inline-block">
            <div className="bg-gameboy border-4 border-gameboyDark rounded-none p-2 hover:brightness-110 transition inline-flex items-center gap-2">
              <img
                src="/images/toad-image.png"
                alt="Toad"
                className="w-8 h-8"
              />
              <img
                src="/images/tictactoadbutton.png"
                alt="Play Tic Tac Toad"
                className="h-14"
              />
            </div>
          </Link>

          <Link to="/blob-paper-scissors">
            <div className="bg-gameboy border-4 border-gameboyDark rounded-none p-2 hover:brightness-110 transition inline-flex items-center gap-2">
              <img
                src="/images/blob-image.png"
                alt="Blob"
                className="w-8 h-8"
              />
              <img
                src="/images/blobpaperscissorsbutton.png"
                alt="Play Blob Paper Scissors"
                className="h-14"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AdminWithdrawButton />
      <Routes>
        {/* Home route = NOT wrapped in Layout */}
        <Route path="/" element={<Home />} />

        {/* Game routes = wrapped in Layout manually */}
        <Route path="/slot-machine" element={<SlotMachine />} />
        <Route path="/tictactoad" element={<TicTacToad />} />
        <Route path="/blob-paper-scissors" element={<BlobPaperScissors />} />
      </Routes>
    </Router>
  );
}
