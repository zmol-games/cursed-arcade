import React, { useEffect, useState } from "react";
import { publicClient } from "../utils/viemClient";
import { CONTRACTS } from "../utils/contracts";
import { getConnectedWalletAccount } from "../utils/wallet";

export default function PointsDisplay({ refreshTrigger }) {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPoints = async () => {
    setLoading(true);
    setError(null);

    try {
      const account = await getConnectedWalletAccount();

      const result = await publicClient.readContract({
        address: CONTRACTS.arcadePoints.address,
        abi: CONTRACTS.arcadePoints.abi,
        functionName: "getPoints",
        args: [account],
      });

      setPoints(Number(result));
    } catch (err) {
      console.error("❌ Error fetching points:", err);
      setError(err.shortMessage || err.message || "Failed to load points");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
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
            : `Points: ${typeof points === "number" ? points : "—"}`}
      </h2>

      {typeof error === "string" && !error.includes("reading '0'") && (
        <p className="text-red-500 text-xs sm:text-sm mt-1">Error: {error}</p>
      )}
    </div>
  );
}