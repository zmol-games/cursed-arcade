import React, { useState, useEffect } from "react";
import { walletClient, publicClient } from "../utils/viemClient";
import { CONTRACTS } from "../utils/contracts";
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

  // Check if 24 hours have passed since last claim
  const checkCanClaim = async () => {
    const account = await getWalletAccount();

    try {
      // Read the last claim time from the ZmolFaucet contract
      const lastClaim = await publicClient.readContract({
        address: CONTRACTS.zmolFaucet.address,
        abi: CONTRACTS.zmolFaucet.abi,
        functionName: "lastClaimTime",
        args: [account],
      });

      // Convert current time to BigInt for proper comparison
      const currentTime = BigInt(Math.floor(Date.now() / 1000)); // current time as BigInt

      // Ensure lastClaim is a BigInt (if it's returned as a string, convert it)
      const lastClaimBigInt = BigInt(lastClaim.toString()); // Convert lastClaim to BigInt if needed

      const timeDiff = currentTime - lastClaimBigInt; // lastClaim is now BigInt

      console.log("Last Claim Time:", lastClaim); 
      console.log("Time Difference:", timeDiff); 

      // If less than 24 hours (86400 seconds), disable claim
      if (timeDiff < BigInt(86400)) {
        setCanClaim(false);
      } else {
        setCanClaim(true);
      }
    } catch (err) {
      console.error("❌ Error checking claim time:", err);
    }
  };

  // Check if the user can claim when the component loads
  useEffect(() => {
    checkCanClaim();
  }, []);

  const handleClaimCredit = async () => {
    if (!canClaim) return;

    const account = await getWalletAccount();

    setLoading(true);
    setError(null);

    try {
      const txHash = await walletClient.writeContract({
        account,
        address: CONTRACTS.zmolFaucet.address, 
        abi: CONTRACTS.zmolFaucet.abi, 
        functionName: "claimFreeCredit",
        gas: 3000000n,
      });

      await publicClient.waitForTransactionReceipt({ hash: txHash });

      const updatedBalance = await publicClient.readContract({
        address: CONTRACTS.zmolCredits.address,
        abi: CONTRACTS.zmolCredits.abi,
        functionName: "getCredits",
        args: [account],
      });

      if (updatedBalance > 0) {
        playCoinSound();
        onSuccess?.();
        checkCanClaim(); // Check again after claiming
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