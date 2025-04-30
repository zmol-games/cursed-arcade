# 🕹️ Zmol Games

An onchain arcade built for fun and exploration.  
Every game is deployed on [zkSync Era](https://zksync.io) and runs entirely on smart contracts.

> “Pointless, but permanent. Seriously onchain.”  

---

## Live at: [zmol.games](https://zmol.games)

- Fully functional on zkSync mainnet
- All games use a custom credit system (`ZmolCredits`)
- Onchain points 

---

## Games... so far

| Game              | Description                                 |
|------------------|---------------------------------------------|
| 🎰 SlotMachine    | Classic 1-armed bandit with onchain pseudorandomness via `keccak256(...)`.      |
| 🐸 TicTacToad     | Toad & Blob play Tic-Tac-Toe. You are Blob.      |
| 🐙 BlobPaperScissors | Rock-Paper-Scissors but slimier.             |

More games in development. 

---

## Tech stack

- **Smart contracts:** Solidity (0.8.24), modular and upgradeable
- **Frontend:** React + Tailwind + Viem 
- **Deployment:** zkSync Era via Foundry
- **Hosting:** VPS with NGINX, no cloud dependencies

---

## Contracts

Structural contracts are upgradeable. Games (and faucet) are stateless and immutable.  
All deployed on **zkSync Era mainnet**.

| Contract               | Type           | Address |
|------------------------|----------------|---------|
| ZmolCredits (proxy)    | Upgradeable    | [`0xACa79d...`](https://explorer.zksync.io/address/0xACa79d2649464f5Ce8A9A05b6D66cAC6bDD5310b) |
| ArcadePoints (proxy)   | Upgradeable    | [`0x66E881...`](https://explorer.zksync.io/address/0x66E8815136E9E3DEA50c1f63178ff943a89D5083) |
| ZmolCredits (logic)    | Logic Contract | [`0xCca08D...`](https://explorer.zksync.io/address/0xCca08DD6b4dcF52E22197690C1FE564fbF5934cE) |
| ArcadePoints (logic)   | Logic Contract | [`0x8D708d...`](https://explorer.zksync.io/address/0x8D708de0aB5d1b4B400af63C0A25cFBf079f7160) |
| ZmolFaucet             | Standalone     | [`0x2fe310...`](https://explorer.zksync.io/address/0x2fe310860c2c563D0fa547B7E7Ea1ECE121FdfE8) |
| TicTacToad             | Game           | [`0x031E3C...`](https://explorer.zksync.io/address/0x031E3C9d486DA871363F154488924273F5192831) |
| BlobPaperScissors      | Game           | [`0x16fcc2...`](https://explorer.zksync.io/address/0x16fcc22aAf285b4731fD189a1C42f55a01bed2a8) |
| SlotMachine            | Game           | [`0x3d38DF...`](https://explorer.zksync.io/address/0x3d38DF5CAb39759aFaf1D135E88091458dcF96f4) |

> All source code in `/contracts` and not verified on zkSync Explorer because bytecode.

---

## Philosophy

Zmol is about reclaiming the fun of early crypto: no utility, no scams, just strange, technically solid experimentation.

Yes, the contracts are real.  
Yes, it's on mainnet.  
No, it’s not that serious.

---

## Author

Built by anon.  
No funding. No team. Just caffeine and vibes.

---

## License

License: © 2025 Zmol Games. This project is open for educational and personal use only. Commercial use, distribution, or modification is prohibited without prior written permission.

---

> _Zmol is not responsible for your existential crisis._
