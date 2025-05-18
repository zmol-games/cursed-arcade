// src/utils/chains.js

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

export const base = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://mainnet.base.org",
    public: "https://mainnet.base.org",
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://basescan.org",
    },
  },
  testnet: false,
};

export const baseSepolia = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://sepolia.base.org",
    public: "https://sepolia.base.org",
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
};

export const supportedChains = {
  324: zkSyncEra,
  300: zkSyncSepolia,
  8453: base,
  84532: baseSepolia,
};