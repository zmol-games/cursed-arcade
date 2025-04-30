export const zkSyncSepolia = {
  id: 300,
  name: "zkSync Sepolia",
  network: "zksync-sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://sepolia.era.zksync.dev",
    public: "https://sepolia.era.zksync.dev",
  },
  blockExplorers: {
    default: {
      name: "zkSync Explorer",
      url: "https://sepolia.explorer.zksync.io",
    },
  },
  testnet: true,
};
