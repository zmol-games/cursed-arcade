import ZmolCreditsABI from "../abis/ZmolCredits.json";
import ArcadePointsABI from "../abis/ArcadePoints.json";
import TicTacToadABI from "../abis/TicTacToad.json";
import BlobPaperScissorsABI from "../abis/BlobPaperScissors.json";
import SlotMachineABI from "../abis/SlotMachine.json";
import ZmolFaucetABI from "../abis/ZmolFaucet.json";

export const CONTRACTS = {
  arcadePoints: {
    address: "0x3369558E7F64CBD6634763988B8C318cd232159B", // Use proxy address
    abi: ArcadePointsABI.abi,
  },
  zmolCredits: {
    address: "0xAB78b49d877841f4329591946bD56D98f5879D70", // Use proxy address
    abi: ZmolCreditsABI.abi,
  },
  ticTacToad: {
    address: "0x031E3C9d486DA871363F154488924273F5192831", // Use proxy address
    abi: TicTacToadABI.abi,
  },
  blobPaperScissors: {
    address: "0x16fcc22aAf285b4731fD189a1C42f55a01bed2a8", // Use proxy address
    abi: BlobPaperScissorsABI.abi,
  },
  slotMachine: {
    address: "0x3d38DF5CAb39759aFaf1D135E88091458dcF96f4", // Use proxy address
    abi: SlotMachineABI.abi,
  },
  zmolFaucet: {
    address: "0x2fe310860c2c563D0fa547B7E7Ea1ECE121FdfE8",
    abi: ZmolFaucetABI.abi,
  },
};
