// src/utils/viemClient.js
import { createPublicClient, createWalletClient, http, custom } from 'viem'
import { supportedChains } from './chains'

// Returns a public client for the given chainId
export function getPublicClient(chainId) {
  const chain = supportedChains[chainId];
  if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default),
  });
}

// Returns a wallet client for the given chainId
export async function getWalletClient(chainId) {
  const chain = supportedChains[chainId];
  if (!chain) throw new Error(`Unsupported chainId: ${chainId}`);
  return createWalletClient({
    chain,
    transport: custom(window.ethereum),
  });
}

// (Optional) helper if you want to get current chainId as a number
export async function getCurrentChainId() {
  const hex = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(hex, 16);
}
