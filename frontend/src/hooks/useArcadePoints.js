import { useAccount, useReadContract } from "wagmi";
import { CONTRACTS } from "../utils/contracts";

export function useArcadePoints() {
  const { address } = useAccount();

  const { data, isPending, error } = useReadContract({
    abi: CONTRACTS.arcadePoints.abi,
    address: CONTRACTS.arcadePoints.address,
    functionName: "getPoints",
    args: [address],
  });

  return {
    points: data?.toString() || "0",
    isLoading: isPending,
    error,
  };
}
