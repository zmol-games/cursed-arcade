// src/utils/localhostChain.js
export const localHostChain = {
  id: 31337,
  name: "Anvil",
  network: "anvil",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: "http://localhost:8545", // Correct this to a string
    public: "http://localhost:8545", // Correct this to a string
  },
  blockExplorers: {
    default: { name: "Local", url: "http://localhost:8545" },
  },
  testnet: true,
};
