import React, { useState, useEffect } from "react";
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

export default function FaucetButton({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canClaim, setCanClaim] = useState(true);

  const checkCanClaim = async () => {
    const account = await getWalletAccount();

    try {
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);

      const { address, abi } = getContract("zmolFaucet", chainId);
      const publicClient = getPublicClient(chainId);

      const lastClaim = await publicClient.readContract({
        address,
        abi,
        functionName: "lastClaimTime",
        args: [account],
      });

      const currentTime = BigInt(Math.floor(Date.now() / 1000));
      const lastClaimBigInt = BigInt(lastClaim.toString());
      const timeDiff = currentTime - lastClaimBigInt;

      setCanClaim(timeDiff >= BigInt(86400));
    } catch (err) {
      console.error("❌ Error checking claim time:", err);
    }
  };

  useEffect(() => {
    checkCanClaim();
  }, []);

  const handleClaimCredit = async () => {
    if (!canClaim) return;

    setLoading(true);
    setError(null);

    try {
      const account = await getWalletAccount();
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);

      const walletClient = await getWalletClient(chainId); 
      const publicClient = getPublicClient(chainId);

      const { address: faucetAddress, abi: faucetAbi } = getContract("zmolFaucet", chainId);

      const txHash = await walletClient.writeContract({
        account,
        address: faucetAddress,
        abi: faucetAbi,
        functionName: "claimFreeCredit",
        gas: 3000000n,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      const { address: creditsAddress, abi: creditsAbi } = getContract("zmolCredits", chainId);

      const updatedBalance = await publicClient.readContract({
        address: creditsAddress,
        abi: creditsAbi,
        functionName: "getCredits",
        args: [account],
      });

      if (updatedBalance > 0) {
        playCoinSound();
        onSuccess?.();
        checkCanClaim();
      } else {
        setError("Something went wrong with the transaction.");
      }
    } catch (err) {
      console.error("❌ claim error:", err);
      setError(err.shortMessage || err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <button
          onClick={handleClaimCredit}
          disabled={loading || !canClaim} // Disable button if not allowed to claim
          className="bg-gameboy hover:bg-[#ccff33] font-ibm px-4 py-2 rounded-md text-sm text-white hover:text-gameboyDark disabled:opacity-50 hover:shadow-[0_0_10px_2px_#8bac0f] transition-all duration-200"
        >
          {loading ? "Claiming..." : "1 FREE CREDIT"}
        </button>
        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
          Claim 1 free credit to your connected wallet every 24 hours
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}