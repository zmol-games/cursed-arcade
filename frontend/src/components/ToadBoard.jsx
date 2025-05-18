import React, { useState } from "react";
import { getWalletClient, getPublicClient } from "../utils/viemClient";
import { decodeEventLog } from "viem";
import { getContract } from "../utils/getContract";
import { getWalletAccount } from "../utils/wallet";

const cellLabels = {
  0: "",
  1: "/images/blob-image.png", // Player (Blob)
  2: "/images/toad-image.png", // Adversary (Toad)
};

export default function ToadBoard({ gameId, onPlayerMove, onGameEnd }) {
  const [board, setBoard] = useState(Array(9).fill(0)); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [gameOver, setGameOver] = useState(false);
  const [outcome, setOutcome] = useState(null); // 0 = win, 1 = loss, 2 = draw

  const playCell = async (cell) => {
    setLoading(true);
    if (onPlayerMove) onPlayerMove();
    setError(null);

    const account = await getWalletAccount();

    try {
      const chainIdHex = await window.ethereum.request({ method: "eth_chainId" });
      const chainId = parseInt(chainIdHex, 16);
      const walletClient = await getWalletClient(chainId);       
      const publicClient = getPublicClient(chainId);           
      const { address, abi } = getContract("ticTacToad", chainId); 

      const txHash = await walletClient.writeContract({
        account,
        address,
        abi,
        functionName: "playTurn",
        args: [gameId, cell],
        gas: 200000n,
      });


      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      });

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted");
      }

      const decodedLogs = receipt.logs
        .map((log) => {
          try {
            return decodeEventLog({
              abi,
              data: log.data,
              topics: log.topics,
            });
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      const newBoard = [...board];
      const toadMoveQueue = [];

      decodedLogs.forEach((log) => {
        if (log.eventName === "MoveMade") {
          const index = Number(log.args.cell);
          const marker = Number(log.args.marker);

          if (marker === 1) {
            newBoard[index] = 1;
            setBoard([...newBoard]);
          }

          if (marker === 2) {
            toadMoveQueue.push(index);
          }
        }

        if (log.eventName === "GameEnded") {
          const outcomeValue = Number(log.args.outcome);
          setGameOver(true);
          setOutcome(outcomeValue);
          if (onGameEnd) onGameEnd(outcomeValue);
        }
      });

      if (toadMoveQueue.length > 0) {
        setTimeout(() => {
          const updatedBoard = [...newBoard];
          toadMoveQueue.forEach((i) => {
            updatedBoard[i] = 2;
          });
          setBoard(updatedBoard);
        }, 600);
      }
    } catch (err) {
      console.error(err);
      setError(err.shortMessage || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {board.map((cellValue, i) => (
          <button
            key={i}
            onClick={() => playCell(i)}
            disabled={cellValue !== 0 || loading || gameOver}
            className={`w-20 h-20 text-3xl text-black rounded shadow ${
              gameOver
                ? "bg-[#d6df69] animate-bounce"
                : "bg-[#d6df69] hover:bg-[#c5cf5e]"
            } disabled:opacity-80`}
          >
            {cellValue === 2 ? (
              <img
                src={cellLabels[cellValue]}
                alt="Toad"
                className="w-full h-full object-contain"
              />
            ) : cellValue === 1 ? (
              <img
                src={cellLabels[cellValue]}
                alt="Player"
                className="w-full h-full object-contain"
              />
            ) : (
              cellLabels[cellValue]
            )}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 font-ibm text-2xl font-bold text-black flex flex-col items-center">
          {outcome === 0 && "You win!"}
          {outcome === 1 && (
            <>
              You lose!
              <img
                src="/images/happy-toad.png"
                alt="Happy Toad"
                className="w-20 h-20 mt-2"
              />
            </>
          )}
          {outcome === 2 && "Is draw."}
        </div>
      )}

      {typeof error === "string" && !error.includes("reading '0'") && (
        <p className="text-red-500">Error: {error}</p>
      )}
    </div>
  );
}