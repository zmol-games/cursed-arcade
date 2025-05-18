import React, { useState, useEffect } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { getContract } from "../utils/getContract";
import { decodeEventLog } from "viem";
import { getWalletAccount } from "../utils/wallet";
import Layout from "../components/Layout";

const playSpinSound = () => {
  const audio = new Audio("/sounds/slotspin.mp3");
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

const playSlotWinSound = () => {
  const audio = new Audio("/sounds/slotwin.mp3");
  audio.volume = 0.4;
  audio.play().catch(() => {});
};

const playSkullWinSound = () => {
  const audio = new Audio("/sounds/skullwin.mp3");
  audio.volume = 0.6;
  audio.play().catch(() => {});
};

const slotImages = {
  0: { src: "/images/cherry.png", alt: "Cherry" },
  1: { src: "/images/seven.png", alt: "Seven" },
  2: { src: "/images/skull.png", alt: "Skull" },
};

const slotEnum = {
  0: "Cherry",
  1: "Seven",
  2: "Skull",
};

export default function SlotMachine({ refresh }) {
  const [reels, setReels] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fakeReels, setFakeReels] = useState([0, 1, 2]);
  const [showSkullRain, setShowSkullRain] = useState(false);
  const [showBlackout, setShowBlackout] = useState(false);
  const [creditsRefreshKey, setCreditsRefreshKey] = useState(0);
  const [pointsRefreshKey, setPointsRefreshKey] = useState(0);

  useEffect(() => {
    if (win) {
      const timer = setTimeout(() => {
        setWin(false);
        setShowSkullRain(false);
      }, 16000);
      return () => clearTimeout(timer);
    }
  }, [win]);

  useEffect(() => {
    if (showBlackout) {
      const timer = setTimeout(() => {
        setShowBlackout(false);
      }, 8000); // duration of the animation
      return () => clearTimeout(timer);
    }
  }, [showBlackout]);

  useEffect(() => {
    if (!spinning) return;

    const interval = setInterval(() => {
      const shuffled = Array(3)
        .fill(null)
        .map(() => Math.floor(Math.random() * 3)); // random 0,1,2
      setFakeReels(shuffled);
    }, 100);

    return () => clearInterval(interval);
  }, [spinning]);

  const playGame = async () => {
    setLoading(true);
    playSpinSound();
    setSpinning(true);
    setError(null);
    setReels([]);
    setWin(false);
    setShowSkullRain(false);

    try {
      const account = await getWalletAccount();
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);
      const walletClient = await getWalletClient(chainId);
      const { address, abi } = getContract("slotMachine", chainId);
      const publicClient = getPublicClient(chainId);

      console.log("Account used in playGame:", account);

      let txHash;

      try {
        txHash = await walletClient.writeContract({
          account,
          address,
          abi,
          functionName: "play",
          gas: 300000n,
        });
      } catch (err) {
        console.error("💥 writeContract failed:", err);
        setError("Transaction failed — maybe not enough credits?");
        setLoading(false);
        return;
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Out of credits - buy more to play!");
      }

      const rawLogs = receipt.logs;
      const decodedLogs = rawLogs
        .filter((log) => log.address.toLowerCase() === address.toLowerCase())
        .map((log) => {
          try {
            return decodeEventLog({
              abi,
              data: log.data,
              topics: log.topics,
            });
          } catch (err) {
            console.warn("❌ Log decode failed:", err);
            return null;
          }
        })
        .filter(Boolean);

      console.log("🧾 Decoded logs:", decodedLogs);

      decodedLogs.forEach((log) => {
        const { eventName, args } = log;

        if (eventName === "CreditUsed") {
          setTimeout(() => {
            setCreditsRefreshKey((k) => k + 1);
          }, 500);
        }

        if (eventName === "SpinResult" && args.win) {
          setTimeout(() => {
            setPointsRefreshKey((k) => k + 1);
          }, 500);
        }

        if (eventName === "PointsFailed") {
          console.warn("⚠️ PointsFailed event for player:", args.player);
        }
      });

      const spinLog = decodedLogs.find((log) => log.eventName === "SpinResult");
      if (
        !spinLog ||
        typeof spinLog.args !== "object" ||
        !Array.isArray(spinLog.args.result)
      ) {
        throw new Error("SpinResult event missing");
      }

      const { result, win } = spinLog.args;

      setReels(
        Array.isArray(result)
          ? result.map((n) => {
              const label = slotEnum[n];
              return label || `??(${n})`;
            })
          : [],
      );

      if (win) {
        setWin(true);
        const isSkullJackpot = result.every((r) => r === 2);
        setShowSkullRain(isSkullJackpot);

        if (isSkullJackpot) {
          setShowBlackout(true);
          playSkullWinSound();
        } else {
          playSlotWinSound();
        }
      }

      setSpinning(false);
    } catch (err) {
      const message = err?.shortMessage || err?.message || "Transaction failed";

      if (message.includes("spendCredit") || message.includes("revert")) {
        setError("Buy more credits to play!");
      } else {
        setError(message);
      }

      console.error("💥 Final catch:", err);
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
      {showBlackout && <div className="blackout"></div>}

      {win && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
          {Array.from({ length: 200 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2;

            return (
              <img
                key={i}
                src={
                  showSkullRain
                    ? "/images/skullcoin.png"
                    : "/images/happy-toad.png"
                }
                alt="Coin"
                className="coin"
                style={{
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: "8s",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Game container*/}
      <div className="px-4 py-8 sm:px-8 border-4 border-gameboyButton rounded-2xl shadow-[0_4px_12px_#8bac0f] bg-gameboyFade w-full max-w-md text-center">
        <h2 className="text-4xl font-gameboy text-gameboyDark mb-6">
          Slot Machine
        </h2>

        {typeof error === "string" && !error.includes("reading '0'") && (
          <p className="text-red-500 mt-4">Error: {error}</p>
        )}

        {spinning && (
          <div className="mt-10 flex justify-center gap-8 animate-pulse">
            {fakeReels.map((idx, i) => (
              <img
                key={i}
                src={slotImages[idx].src}
                alt={slotImages[idx].alt}
                className="w-20 h-20"
              />
            ))}
          </div>
        )}

        {!spinning && Array.isArray(reels) && reels.length > 0 && (
          <div className="mt-10">
            <div className="flex justify-center gap-8 mb-6">
              {reels.map((label, i) => {
                const key = Object.keys(slotEnum).find(
                  (k) => slotEnum[k] === label,
                );
                return (
                  <img
                    key={i}
                    src={slotImages[key]?.src}
                    alt={label}
                    className="w-20 h-20"
                  />
                );
              })}
            </div>
            <p
              className={`font-ibm text-xl mt-6 ${win ? "text-gameboyDark animate-shake" : "text-gray-600"}`}
            >
              {win ? "YOU WIN!!!" : "Try again"}
            </p>
          </div>
        )}

        {/* Spin button always available */}
        <button
          onClick={playGame}
          disabled={loading}
          className="mt-10 font-ibm bg-gameboyButton text-white px-8 py-4 rounded hover:bg-gameboyMedium"
        >
          {loading ? "Spinning..." : "SPIN"}
        </button>
      </div>
    </Layout>
  );
}
