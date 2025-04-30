// utils/wallet.js

// Safe check: only reads currently connected account, no popup
export async function getConnectedWalletAccount() {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    throw new Error("No wallet available");
  }

  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  if (!Array.isArray(accounts) || accounts.length === 0) {
    throw new Error("No wallet connected");
  }

  return accounts[0];
}

// Full check: prompts wallet connect if needed
export async function getWalletAccount() {
  if (typeof window === "undefined" || typeof window.ethereum === "undefined") {
    throw new Error("No wallet available");
  }

  let accounts = await window.ethereum.request({ method: "eth_accounts" });
  if (!Array.isArray(accounts) || accounts.length === 0) {
    accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  if (!Array.isArray(accounts) || accounts.length === 0) {
    throw new Error("Wallet connection failed");
  }

  return accounts[0];
}
