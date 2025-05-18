import { CONTRACTS } from "./contracts";

export function getContract(name, chainId) {
  const contract = CONTRACTS[name]?.[chainId];
  if (!contract) {
    throw new Error(`Contract "${name}" not found for chain ID ${chainId}`);
  }
  return contract;
}
