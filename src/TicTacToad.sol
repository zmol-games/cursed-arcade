// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ArcadePoints} from "./ArcadePoints.sol";
import {ZmolCredits} from "./ZmolCredits.sol";

contract TicTacToad is Ownable, ReentrancyGuard {
    enum Cell {
        Empty,
        Player,
        Blob
    }
    enum Outcome {
        Win,
        Loss,
        Draw
    }
    enum Turn {
        Player,
        Blob
    }

    struct Game {
        address player;
        uint256 board; // 9 cells, 2 bits each
        bool active;
        Turn turn;
    }

    uint256 public gameCounter;

    mapping(uint256 => Game) public games;
    mapping(address => uint256[]) public playerGames;

    event GameStarted(uint256 indexed gameId, address indexed player);
    event CreditUsed(address indexed player);
    event MoveMade(uint256 indexed gameId, address indexed player, uint8 cell, Cell marker);
    event GameEnded(uint256 indexed gameId, address indexed winner, Outcome outcome);
    event PointsFailed(address indexed player);

    ArcadePoints public immutable i_arcadePoints;
    ZmolCredits public immutable i_zmolCredits;

    constructor(address _arcadePoints, address _zmolCredits) Ownable(msg.sender) {
        i_arcadePoints = ArcadePoints(_arcadePoints);
        i_zmolCredits = ZmolCredits(payable(_zmolCredits));
    }

    modifier onlyPlayer(uint256 gameId) {
        require(msg.sender == games[gameId].player, "Not your game");
        _;
    }

    function startGame() external payable nonReentrant returns (uint256 gameId) {
        i_zmolCredits.spendCredit(msg.sender);
        emit CreditUsed(msg.sender);

        gameId = gameCounter++;

        emit GameStarted(gameId, msg.sender);

        games[gameId] = Game(msg.sender, 0, true, Turn.Player);
        playerGames[msg.sender].push(gameId);
    }

    function playTurn(uint256 gameId, uint8 cell) external nonReentrant onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.active, "Game not active");
        require(cell < 9, "Invalid cell");
        require(getCell(game.board, cell) == Cell.Empty, "Cell taken");
        require(game.turn == Turn.Player, "Not your turn");

        // Player move
        game.board = setCell(game.board, cell, Cell.Player);
        emit MoveMade(gameId, msg.sender, cell, Cell.Player);

        // Player win
        if (checkWin(game.board, Cell.Player)) {
            game.active = false;
            try i_arcadePoints.addPoints(msg.sender, 1) {
            } catch {
                emit PointsFailed(msg.sender);
            }
            emit GameEnded(gameId, msg.sender, Outcome.Win);
            return;
        }

        // Check for draw before Blob move
        bool isDraw = true;
        for (uint8 i = 0; i < 9; i++) {
            if (getCell(game.board, i) == Cell.Empty) {
                isDraw = false;
                break;
            }
        }
        if (isDraw) {
            game.active = false;
            emit GameEnded(gameId, address(0), Outcome.Draw);
            return;
        }

        game.turn = Turn.Blob;

        // Blob move
        uint8 blobCell = blobMove(game.board);
        game.board = setCell(game.board, blobCell, Cell.Blob);
        emit MoveMade(gameId, address(this), blobCell, Cell.Blob);

        // Blob win
        if (checkWin(game.board, Cell.Blob)) {
            game.active = false;
            emit GameEnded(gameId, address(this), Outcome.Loss);
            return;
        }

        game.turn = Turn.Player; // switch turn to player
    }

    function getCell(uint256 board, uint8 index) public pure returns (Cell) {
        require(index < 9, "Out of bounds");
        return Cell((board >> (index * 2)) & 0x03);
    }

    function setCell(uint256 board, uint8 index, Cell value) public pure returns (uint256) {
        require(index < 9, "Out of bounds");
        require(uint8(value) <= 2, "Invalid cell value");
        uint256 mask = ~(uint256(3) << (index * 2));
        return (board & mask) | (uint256(value) << (index * 2));
    }

    function blobMove(uint256 board) internal view virtual returns (uint8) {
        // First, try to block player from winning
        for (uint8 i = 0; i < 9; i++) {
            if (getCell(board, i) == Cell.Empty) {
                uint256 simulated = setCell(board, i, Cell.Player);
                if (checkWin(simulated, Cell.Player)) {
                    return i; // Block this move
                }
            }
        }

        // Otherwise, play the first available cell
        for (uint8 i = 0; i < 9; i++) {
            if (getCell(board, i) == Cell.Empty) {
                return i;
            }
        }

        revert("No moves left");
    }

    function checkWin(uint256 board, Cell who) public pure returns (bool) {
        require(uint8(who) <= 2, "Invalid cell type");

        uint8[3][8] memory wins =
            [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (uint8 i = 0; i < 8; i++) {
            if (
                getCell(board, wins[i][0]) == who && getCell(board, wins[i][1]) == who
                    && getCell(board, wins[i][2]) == who
            ) {
                return true;
            }
        }
        return false;
    }

    function getBoard(uint256 gameId) external view returns (uint256) {
        return games[gameId].board;
    }

    function getGameState(uint256 gameId) external view returns (address player, bool active, uint256 board) {
        Game memory g = games[gameId];
        return (g.player, g.active, g.board);
    }

    function getCellValue(uint256 gameId, uint8 index) external view returns (Cell) {
        return getCell(games[gameId].board, index);
    }

    function withdraw() external onlyOwner {
        (bool success,) = payable(owner()).call{value: address(this).balance}("");
        require(success, "ETH withdraw failed");
    }

    receive() external payable {}
    fallback() external payable {}
}
