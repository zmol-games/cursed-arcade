import React, { useEffect, useState } from "react";
import { publicClient } from "../utils/viemClient";
import { CONTRACTS } from "../utils/contracts";
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

      const creditCount = await publicClient.readContract({
        address: CONTRACTS.zmolCredits.address,
        abi: CONTRACTS.zmolCredits.abi,
        functionName: "getCredits",
        args: [account],
      });

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

  if (error?.includes("No wallet")) {
    return null;
  }

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
