// src/utils/zkSyncEraChain.js
export const zkSyncEra = {
  id: 324,
  name: "zkSync Era",
  network: "zksync-era",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://mainnet.era.zksync.io",
    public: "https://mainnet.era.zksync.io",
  },
  blockExplorers: {
    default: {
      name: "zkSync Explorer",
      url: "https://explorer.zksync.io",
    },
  },
  testnet: false,
};
