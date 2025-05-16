import ZmolCreditsABI from "../abis/ZmolCredits.json";
import ArcadePointsABI from "../abis/ArcadePoints.json";
import TicTacToadABI from "../abis/TicTacToad.json";
import BlobPaperScissorsABI from "../abis/BlobPaperScissors.json";
import SlotMachineABI from "../abis/SlotMachine.json";
import ZmolFaucetABI from "../abis/ZmolFaucet.json";
import MadameZmoltraABI from "../abis/MadameZmoltra.json";

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
    address: "0x031E3C9d486DA871363F154488924273F5192831", 
    abi: TicTacToadABI.abi,
  },
  blobPaperScissors: {
    address: "0x16fcc22aAf285b4731fD189a1C42f55a01bed2a8", 
    abi: BlobPaperScissorsABI.abi,
  },
  slotMachine: {
    address: "0x3d38DF5CAb39759aFaf1D135E88091458dcF96f4", 
    abi: SlotMachineABI.abi,
  },
  zmolFaucet: {
    address: "0x2fe310860c2c563D0fa547B7E7Ea1ECE121FdfE8",
    abi: ZmolFaucetABI.abi,
  },
  madameZmoltra: {
    address: '0x0D2D1836677B162BB60C00459B020117383E8AB7', 
    abi: MadameZmoltraABI.abi,
  },
};
