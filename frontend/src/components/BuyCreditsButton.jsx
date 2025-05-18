import React, { useState } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { getContract } from "../utils/getContract";
import { getWalletAccount } from "../utils/wallet";

const playCoinSound = () => {
  const audio = new Audio("/sounds/coin.wav");
  audio.volume = 0.5;
  audio.play().catch((err) => {
    console.warn("🔇 Audio failed:", err);
  });
};

export default function BuyCreditsButton({ onSuccess }) {
  const [numCredits, setNumCredits] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBuyCredits = async () => {
    if (numCredits % 10 !== 0) {
      alert("Credits must be bought in batches of 10.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const account = await getWalletAccount();
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);
    
      const walletClient = await getWalletClient(chainId);
      const publicClient = getPublicClient(chainId); // ✅ this is what was missing
      const { address, abi } = getContract("zmolCredits", chainId);
      
      const txHash = await walletClient.writeContract({
        account,
        address,
        abi,
        functionName: "buyCredits",
        args: [numCredits],
        value: BigInt(numCredits / 10) * BigInt(1e15),
        gas: 3000000n,
      });
    
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      const updatedBalance = await publicClient.readContract({
        address,
        abi,
        functionName: "getCredits",
        args: [account],
      });

      if (updatedBalance > 0) {
        playCoinSound();
        onSuccess?.();
      } else {
        setError("Something went wrong with the transaction.");
      }
    } catch (err) {
      console.error("❌ write error:", err);
      setError(err.shortMessage || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mt-0 flex items-center justify-center">
        <input
          type="number"
          min={10}
          step={10}
          value={numCredits}
          onChange={(e) => setNumCredits(Number(e.target.value))}
          className="w-20 p-2 font-ibm rounded-md bg-zinc-800 text-white"
        />
        <button
          onClick={handleBuyCredits}
          disabled={loading}
          className="bg-gameboyButton hover:bg-[#ccff33] animate-flicker font-ibm ml-4 px-4 py-2 rounded-md text-white hover:text-gameboyDark disabled:opacity-50 hover:shadow-[0_0_10px_2px_#8bac0f] hover:animate-cursed disabled:opacity-50 transition-all duration-200"
        >
          {loading ? "Buying..." : "BUY CREDITS"}
        </button>
      </div>

      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
}
