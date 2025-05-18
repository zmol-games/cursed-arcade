import React, { useEffect, useState } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { getContract } from "../utils/getContract";
import { getConnectedWalletAccount } from "../utils/wallet";

export default function CreditDisplay({ refreshTrigger }) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCredits = async () => {
    setLoading(true);
    setError(null);

    try {
      const account = await getConnectedWalletAccount();

      // Get the chain ID from the wallet
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);

      const { address, abi } = getContract("zmolCredits", chainId);
      const publicClient = getPublicClient(chainId);

      let creditCount;

      try {
        creditCount = await publicClient.readContract({
          address,
          abi,
          functionName: "getCredits",
          args: [account],
        });
      } catch (err) {
        if (
          err.message?.includes("returned no data") ||
          err.message?.includes("execution reverted")
        ) {
          creditCount = 0;
        } else {
          throw err;
        }
      }

      setCredits(Number(creditCount));
    } catch (err) {
      console.error("❌ Error fetching credits:", err);
      setError(err.shortMessage || err.message || "Failed to fetch credits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [refreshTrigger]);

  if (error?.includes("No wallet")) return null;

  return (
    <div className="w-[10rem] sm:w-[13rem] h-auto p-4 font-ibm bg-zinc-900 rounded-lg text-white shadow-inner text-center flex flex-col justify-center">
      <h2 className="text-lg sm:text-xl leading-tight">
        {loading
          ? "Loading..."
          : typeof error === "string" && !error.includes("reading '0'")
            ? "Error"
            : `Credits: ${typeof credits === "number" ? credits : "—"}`}
      </h2>

      {typeof error === "string" && !error.includes("reading '0'") && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">Error: {error}</p>
      )}
    </div>
  );
}
