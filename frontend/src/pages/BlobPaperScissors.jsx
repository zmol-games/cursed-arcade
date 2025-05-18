import React, { useState } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { decodeEventLog } from "viem";
import { getContract } from "../utils/getContract";
import { getWalletAccount } from "../utils/wallet";
import Layout from "../components/Layout";

const playBlobSound = () => {
  const audio = new Audio("/sounds/blobsound.m4a");
  audio.volume = 0.5;
  audio.play().catch((err) => console.warn("🔇 Blob sound failed:", err));
};

const playPaperSound = () => {
  const audio = new Audio("/sounds/paper.mp3");
  audio.volume = 0.5;
  audio.play().catch((err) => console.warn("🔇 Paper sound failed:", err));
};

const playScissorsSound = () => {
  const audio = new Audio("/sounds/scissors.mp3");
  audio.volume = 0.5;
  audio.play().catch((err) => console.warn("🔇 Scissors sound failed:", err));
};

const playWinSound = () => {
  const audio = new Audio("/sounds/win.mp3");
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

const playLoseSound = () => {
  const audio = new Audio("/sounds/lose.mp3");
  audio.volume = 0.3;
  audio.play().catch(() => {});
};

const playDrawSound = () => {
  const audio = new Audio("/sounds/draw.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

const moveAssets = {
  0: { src: "/images/blob-image.png", alt: "Blob" },
  1: { src: "/images/paper-image.png", alt: "Paper" },
  2: { src: "/images/scissors-image.png", alt: "Scissors" },
};

const outcomeLabels = {
  0: "You win!",
  1: "You lose :(",
  2: "Tie",
};

export default function BlobPaperScissors() {
  const [playerMove, setPlayerMove] = useState(null);
  const [toadMove, setToadMove] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0);
  const [pointsRefreshKey, setPointsRefreshKey] = useState(0);

  const playGame = async (selectedMove) => {
    setLoading(true);
    setError(null);
    setPlayerMove(null);
    setToadMove(null);
    setOutcome(null);

    if (selectedMove === 0) playBlobSound();
    if (selectedMove === 1) playPaperSound();
    if (selectedMove === 2) playScissorsSound();

    try {
      const account = await getWalletAccount();

      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);

      const walletClient = await getWalletClient(chainId);
      const publicClient = getPublicClient(chainId);

      const { address, abi } = getContract("blobPaperScissors", chainId);

      const txHash = await walletClient.writeContract({
        account,
        address,
        abi,
        functionName: "play",
        args: [selectedMove],
        gas: 300000n,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });
      console.log("📬 Receipt status:", receipt.status);
      console.log("📦 Raw logs:", receipt.logs);

      if (receipt.status !== "success")
        throw new Error("Out of credits - buy more to play!");

      const decodedLogs = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi,
              data: log.data,
              topics: log.topics,
            });
          } catch (err) {
            return null;
          }
        })
        .filter(Boolean);

      const gameLog = decodedLogs.find((log) => log.eventName === "GamePlayed");
      console.log("🎯 Decoded event:", gameLog);

      if (!gameLog || !gameLog.args)
        throw new Error("GamePlayed event missing");

      const outcomeValue = Number(gameLog.args.outcome);

      // Refresh points if user won
      if (outcomeValue === 0) {
        setTimeout(() => {
          setPointsRefreshKey((k) => k + 1);
        }, 500);
      }

      // Always refresh credits after a game
      setTimeout(() => {
        setCreditsRefreshKey((k) => k + 1);
      }, 800);

      setPlayerMove(Number(gameLog.args.playerMove));
      setToadMove(Number(gameLog.args.blobMove));
      setOutcome(outcomeValue);

      if (outcomeValue === 0) playWinSound();
      else if (outcomeValue === 1) playLoseSound();
      else if (outcomeValue === 2) playDrawSound();
    } catch (err) {
      setError(err.shortMessage || err.message || "Something went wrong");
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
      <div className="px-4 py-8 sm:px-8 border-4 border-gameboyButton rounded-2xl shadow-[0_4px_12px_#8bac0f] bg-gameboyFade w-full max-w-md text-center">
        <h1 className="text-3xl font-gameboy mb-4 text-gameboyButton">
          Blob Paper Scissors
        </h1>

        <p className="font-ibm mb-4 text-gameboyDark">Choose your move:</p>

        <div className="flex justify-center gap-6 mb-8">
          {[0, 1, 2].map((move) => (
            <button
              key={move}
              onClick={() => playGame(move)}
              disabled={loading}
              className="px-4 py-2 sm:px-6 sm:py-4 font-vt bg-gameboy rounded hover:shadow-[0_0_10px_2px_#8bac0f] hover:animate-cursed disabled:opacity-50 transition-all duration-200 h-28 sm:h-32"
            >
              <div className="flex flex-col items-center justify-between h-full">
                <img
                  src={moveAssets[move].src}
                  alt={moveAssets[move].alt}
                  className="w-10 h-10 object-contain mb-1"
                />
                <span className="text-2xl text-gameboyDark">
                  {moveAssets[move].alt}
                </span>
              </div>
            </button>
          ))}
        </div>

        {loading && (
          <p className="font-vt text-yellow-400">
            blob... paper... scissors...
          </p>
        )}
        {typeof error === "string" && !error.includes("reading '0'") && (
          <p className="text-red-500 mt-2">Error: {error}</p>
        )}

        {playerMove !== null && toadMove !== null && outcome !== null && (
          <div className="mt-8 bg-gameboyDark p-4 rounded-lg shadow">
            <div className="flex justify-center gap-6 mb-4">
              <div className="w-24 h-24 flex flex-col items-center justify-center bg-gameboy rounded shadow-md font-vt">
                <img
                  src={moveAssets[playerMove].src}
                  alt="Your move"
                  className="w-10 h-10 mb-1"
                />
                <span className="text-lg text-black">You</span>
              </div>
              <div className="w-24 h-24 flex flex-col items-center justify-center bg-gameboy rounded shadow-md font-vt">
                <img
                  src={moveAssets[toadMove].src}
                  alt="Toad move"
                  className="w-10 h-10 mb-1"
                />
                <span className="text-lg text-black">Toad</span>
              </div>
            </div>

            <p className="font-ibm text-2xl text-white mt-4">
              {outcomeLabels[outcome]}
            </p>

            <button
              onClick={() => {
                setPlayerMove(null);
                setToadMove(null);
                setOutcome(null);
              }}
              className="mt-4 px-4 font-vt py-2 bg-gameboyButton hover:bg-lime-600 rounded text-white"
            >
              Play again
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}