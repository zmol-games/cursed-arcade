import { useState, useEffect } from "react";
import { getWalletClient, getCurrentChainId } from "../utils/viemClient";
import { getContract } from "../utils/getContract";
import { getConnectedWalletAccount } from "../utils/wallet";

export default function AdminWithdrawButton() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const account = await getConnectedWalletAccount();
        if (
          account?.toLowerCase() ===
          "0xeaC858B29c37c349945b9d1AA4E2834dC04389Fa".toLowerCase()
        ) {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error("Admin check failed:", err);
      }
    }
    checkAdmin();
  }, []);

  if (!isAdmin) return null;

  const handleWithdraw = async () => {
    try {
      const account = await getConnectedWalletAccount();
      const chainId = await getCurrentChainId();
      const walletClient = await getWalletClient(chainId);
      const { address, abi } = getContract("zmolCredits", chainId);

      const txHash = await walletClient.writeContract({
        account,
        address,
        abi,
        functionName: "withdraw",
        gas: 300000n,
      });

      console.log("Withdraw tx:", txHash);
      alert("Withdraw transaction sent!");
    } catch (err) {
      console.error("Withdraw failed:", err);
      alert("Failed to withdraw");
    }
  };

  return (
    <div className="absolute bottom-4 left-4 z-50">
      <button
        onClick={handleWithdraw}
        className="px-4 py-2 font-gameboy bg-gameboy hover:bg-gameboyMedium text-gameboyDark rounded shadow-md"
      >
        Withdraw
      </button>
    </div>
  );
}
