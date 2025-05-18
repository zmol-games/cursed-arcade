# 🕹️ Zmol Games

An onchain arcade built for fun and exploration.  
Every game is deployed onchain.

> “Pointless, but permanent. Seriously onchain.”  

---

## Live at: [zmol.games](https://zmol.games)

- Fully functional on **zkSync Era** and **Base mainnet**
- All games use a custom credit system (`ZmolCredits`)
- Onchain points via `ArcadePoints`

---

## Games... so far

| Game              | Description                                 |
|------------------|---------------------------------------------|
| 🎰 SlotMachine    | Slot machine with onchain pseudorandomness via `keccak256(...)`.      |
| 🐸 TicTacToad     | Toad & Blob play Tic-Tac-Toe. You are Blob.      |
| 🐙 BlobPaperScissors | Rock-Paper-Scissors but slimier.             |
| 🔮 Madame Zmoltra | Draw a fortune from the bytecode mists. Some give points. Some give... wisdom? |

More games in development.

---

## Tech stack

- **Smart contracts:** Solidity (0.8.24), modular and upgradeable
- **Frontend:** React + Tailwind + Viem 
- **Deployment:** zkSync Era + Base via Foundry
- **Hosting:** VPS with NGINX, no cloud dependencies

---

## Contracts

Structural contracts are upgradeable. Games (and faucet) are stateless and immutable.  
All contracts are deployed and verified on **zkSync Era** and **Base**.

### zkSync Era Mainnet

| Contract             | Type           | Address |
|----------------------|----------------|---------|
| ZmolCredits (proxy)  | Upgradeable    | [`0xACa79d...`](https://explorer.zksync.io/address/0xAB78b49d877841f4329591946bD56D98f5879D70) |
| ArcadePoints (proxy) | Upgradeable    | [`0x66E881...`](https://explorer.zksync.io/address/0x3369558E7F64CBD6634763988B8C318cd232159B) |
| ZmolCredits (logic)  | Logic Contract | [`0xCca08D...`](https://explorer.zksync.io/address/0xCca08DD6b4dcF52E22197690C1FE564fbF5934cE) |
| ArcadePoints (logic) | Logic Contract | [`0x8D708d...`](https://explorer.zksync.io/address/0x8D708de0aB5d1b4B400af63C0A25cFBf079f7160) |
| ZmolFaucet           | Standalone     | [`0x2fe310...`](https://explorer.zksync.io/address/0x2fe310860c2c563D0fa547B7E7Ea1ECE121FdfE8) |
| TicTacToad           | Game           | [`0x031E3C...`](https://explorer.zksync.io/address/0x031E3C9d486DA871363F154488924273F5192831) |
| BlobPaperScissors    | Game           | [`0x16fcc2...`](https://explorer.zksync.io/address/0x16fcc22aAf285b4731fD189a1C42f55a01bed2a8) |
| SlotMachine          | Game           | [`0x3d38DF...`](https://explorer.zksync.io/address/0x3d38DF5CAb39759aFaf1D135E88091458dcF96f4) |
| MadameZmoltra        | Game           | [`0x0D2D18...`](https://explorer.zksync.io/address/0x0D2D1836677B162BB60C00459B020117383E8AB7) |

### Base Mainnet

| Contract             | Type           | Address |
|----------------------|----------------|---------|
| ZmolCredits (proxy)  | Upgradeable    | [`0xc81eE5...`](https://basescan.org/address/0xc81eE51a1c69DcCED4D6197F05361518628465d3) |
| ArcadePoints (proxy) | Upgradeable    | [`0x35b150...`](https://basescan.org/address/0x35b150C4b9a209EB231759BB1004Bb4f00f0ce93) |
| ZmolCredits (logic)  | Logic Contract | [`0x482DA4...`](https://basescan.org/address/0x482DA48c68547cD5178cD1d50b85fC31381Bdd42) |
| ArcadePoints (logic) | Logic Contract | [`0xc8d619...`](https://basescan.org/address/0xc8d619805e40dEeCa45992401b859DCe3575CB19) |
| ZmolFaucet           | Standalone     | [`0x1053dc...`](https://basescan.org/address/0x1053dca44618f0120CDa45F3e8cb70a0Efc80430) |
| TicTacToad           | Game           | [`0xaEFB21...`](https://basescan.org/address/0xaEFB2156Bc289aC447D20a856A7D02b397EC1D22) |
| BlobPaperScissors    | Game           | [`0x36E3e6...`](https://basescan.org/address/0x36E3e6eEb6610eb2B76f9f9bD219fD8FD99B204F) |
| SlotMachine          | Game           | [`0x24bE93...`](https://basescan.org/address/0x24bE9319866C26811777Ad64Da755eE6aA80351B) |
| MadameZmoltra        | Game           | [`0x6eb7Db...`](https://basescan.org/address/0x6eb7Db43ED0089abD56a910F6cAD3812Aaf703E9) |

✅ **All contracts verified**.  
Source code lives in `/src`. Verified via Foundry + network-specific APIs.

---

## Philosophy

Zmol is about reclaiming the fun of early crypto: no utility, no scams, just technically solid experimentation.

Yes, the contracts are real.  
Yes, it’s on mainnet(s).  
No, it’s not serious.

---

## Author

Built by anon with caffeine and vibes.

---

## License

License: © 2025 Zmol Games. This project is open for educational and personal use only. Commercial use, distribution, or modification is prohibited without prior written permission.

---

> _Zmol is not responsible for your existential crisis._
