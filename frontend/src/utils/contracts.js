import ZmolCreditsABI from "../abis/ZmolCredits.json";
import ArcadePointsABI from "../abis/ArcadePoints.json";
import TicTacToadABI from "../abis/TicTacToad.json";
import BlobPaperScissorsABI from "../abis/BlobPaperScissors.json";
import SlotMachineABI from "../abis/SlotMachine.json";
import ZmolFaucetABI from "../abis/ZmolFaucet.json";
import MadameZmoltraABI from "../abis/MadameZmoltra.json";

export const CONTRACTS = {
  zmolCredits: {
    324: {
      address: "0xAB78b49d877841f4329591946bD56D98f5879D70",
      abi: ZmolCreditsABI.abi,
    },
    8453: {
      address: "0xc81eE51a1c69DcCED4D6197F05361518628465d3",
      abi: ZmolCreditsABI.abi,
    },
  },
  arcadePoints: {
    324: {
      address: "0x3369558E7F64CBD6634763988B8C318cd232159B",
      abi: ArcadePointsABI.abi,
    },
    8453: {
      address: "0x35b150C4b9a209EB231759BB1004Bb4f00f0ce93",
      abi: ArcadePointsABI.abi,
    },
  },
  zmolFaucet: {
    324: {
      address: "0x2fe310860c2c563D0fa547B7E7Ea1ECE121FdfE8",
      abi: ZmolFaucetABI.abi,
    },
    8453: {
      address: "0x1053dca44618f0120CDa45F3e8cb70a0Efc80430",
      abi: ZmolFaucetABI.abi,
    },
  },
  ticTacToad: {
    324: {
      address: "0x031E3C9d486DA871363F154488924273F5192831",
      abi: TicTacToadABI.abi,
    },
    8453: {
      address: "0xaEFB2156Bc289aC447D20a856A7D02b397EC1D22",
      abi: TicTacToadABI.abi,
    },
  },
  blobPaperScissors: {
    324: {
      address: "0x16fcc22aAf285b4731fD189a1C42f55a01bed2a8",
      abi: BlobPaperScissorsABI.abi,
    },
    8453: {
      address: "0x36E3e6eEb6610eb2B76f9f9bD219fD8FD99B204F",
      abi: BlobPaperScissorsABI.abi,
    },
  },
  slotMachine: {
    324: {
      address: "0x3d38DF5CAb39759aFaf1D135E88091458dcF96f4",
      abi: SlotMachineABI.abi,
    },
    8453: {
      address: "0x24bE9319866C26811777Ad64Da755eE6aA80351B",
      abi: SlotMachineABI.abi,
    },
  },
  madameZmoltra: {
    324: {
      address: "0x0D2D1836677B162BB60C00459B020117383E8AB7",
      abi: MadameZmoltraABI.abi,
    },
    8453: {
      address: "0x6eb7Db43ED0089abD56a910F6cAD3812Aaf703E9",
      abi: MadameZmoltraABI.abi,
    },
  },
};
