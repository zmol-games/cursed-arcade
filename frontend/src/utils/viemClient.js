// utils/viemClient.js
import { createPublicClient, createWalletClient, http, custom } from "viem";

// --- zkSync Era Mainnet ---
const zkSyncEra = {
  id: 324,
  name: "zkSync Era",
  network: "zksync-era",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.era.zksync.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "zkSync Explorer",
      url: "https://explorer.zksync.io",
    },
  },
  testnet: false,
};

export const publicClient = createPublicClient({
  chain: zkSyncEra,
  transport: http(zkSyncEra.rpcUrls.default.http[0]),
});

export const walletClient =
  typeof window !== "undefined" && typeof window.ethereum !== "undefined"
    ? createWalletClient({
        chain: zkSyncEra,
        transport: custom(window.ethereum),
      })
    : null;
