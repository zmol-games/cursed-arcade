import React, { useState } from "react";
import { walletClient, publicClient } from "../utils/viemClient";
import { decodeEventLog } from "viem";
import { CONTRACTS } from "../utils/contracts";
import ToadBoard from "../components/ToadBoard";
import { getWalletAccount } from "../utils/wallet";
import Layout from "../components/Layout";

const playToadySound = () => {
  const audio = new Audio("/sounds/toadysound.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

const playMarkerSound = () => {
  const audio = new Audio("/sounds/bump.mp3");
  audio.volume = 0.2;
  audio.play().catch(() => {});
};

const playWinSound = () => {
  const audio = new Audio("/sounds/win2.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

const playLoseSound = () => {
  const audio = new Audio("/sounds/toadwin.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

const playDrawSound = () => {
  const audio = new Audio("/sounds/draw.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

export default function TicTacToad() {
  const [gameId, setGameId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0);
  const [pointsRefreshKey, setPointsRefreshKey] = useState(0);

  const resetGame = () => setGameId(null);

  const handleMarkerSound = () => {
    playMarkerSound();
  };

  const handleOutcomeSound = (outcome) => {
    if (outcome === 0) {
      playWinSound();
      setPointsRefreshKey((k) => k + 1);
    } else if (outcome === 1) {
      playLoseSound();
    } else if (outcome === 2) {
      playDrawSound();
    }
  };

  const startGame = async () => {
    playToadySound();
    setLoading(true);
    setError(null);

    try {
      const account = await getWalletAccount();

      const txHash = await walletClient.writeContract({
        account,
        address: CONTRACTS.ticTacToad.address,
        abi: CONTRACTS.ticTacToad.abi,
        functionName: "startGame",
        gas: 300000n,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Out of credits - buy more to play!");
      }

      const decodedLogs = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi: CONTRACTS.ticTacToad.abi,
              data: log.data,
              topics: log.topics,
            });
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      decodedLogs.forEach((log) => {
        if (log.eventName === "GameStarted") {
          const newGameId = Number(log.args.gameId);
          setGameId(newGameId);
          console.log("🎮 Game started with ID:", newGameId);
        }

        if (log.eventName === "CreditUsed") {
          setCreditsRefreshKey((k) => k + 1);
        }
      });
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      creditsRefreshKey={creditsRefreshKey}
      pointsRefreshKey={pointsRefreshKey}
      onBuyCreditsSuccess={() => setCreditsRefreshKey((k) => k + 1)}
    >
      {/* Game container */}
      <div className="w-full max-w-md px-4 py-8 sm:px-8 border-4 border-gameboyButton rounded-2xl shadow-[0_4px_12px_#8bac0f] bg-gameboyFade text-center">
        <h1 className="text-3xl font-gameboy mb-4 text-[#8bac0f]">
          Tic Tac Toad
        </h1>

        {!gameId && (
          <button
            onClick={startGame}
            disabled={loading}
            className="px-4 py-2 font-ibm bg-gameboyButton text-white rounded hover:bg-green-800"
          >
            {loading ? "Starting..." : "START GAME"}
          </button>
        )}

        {typeof error === "string" && !error.includes("reading '0'") && (
          <p className="text-red-500 mt-4">Error: {error}</p>
        )}

        {gameId !== null && (
          <div className="mt-6">
            <h2 className="font-ibm text-xl text-black mb-2">
              Game ID: {gameId}
            </h2>

            <ToadBoard
              gameId={gameId}
              onPlayerMove={handleMarkerSound}
              onGameEnd={handleOutcomeSound}
            />

            <button
              onClick={resetGame}
              className="mt-6 px-4 py-2 font-vt bg-zinc-700 text-white text-2xl rounded hover:bg-zinc-800"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
