import React, { useEffect, useState } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { getContract } from "../utils/getContract";
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
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);
      const { address, abi } = getContract("arcadePoints", chainId);
      const publicClient = getPublicClient(chainId);

      let result;

      try {
        result = await publicClient.readContract({
        address,
        abi,
        functionName: "getPoints",
        args: [account],
      });
    } catch (err) {
      if (
      err.message?.includes("returned no data") ||
      err.message?.includes("execution reverted")
      ) {
      result = 0;
      } else {
      throw err;
      }
    }

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