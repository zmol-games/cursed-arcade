import { useEffect, useState } from "react";
import { publicClient } from "../utils/viemClient";
import { CONTRACTS } from "../utils/contracts";
import { useAccount } from "wagmi";

export function useZmolCredits() {
  const { address } = useAccount();
  const [credits, setCredits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCredits() {
    if (!address) return;

    setIsLoading(true);
    try {
      const result = await publicClient.readContract({
        address: CONTRACTS.zmolCredits.address,
        abi: CONTRACTS.zmolCredits.abi,
        functionName: "getCredits",
        args: [address],
      });
      setCredits(result);
    } catch (err) {
      console.error("❌ Failed to fetch credits:", err);
      setCredits(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (address) {
      fetchCredits();
    }
  }, [address]);

  return { credits, isLoading, refetch: fetchCredits };
}
