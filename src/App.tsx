import React, { useState, useEffect } from 'react';
import './App.css';
import VictoryMessage from './VictoryMessage';
import './VictoryMessage.css';
import GameOverModal from './GameOverModal';
import './GameOverModal.css';
import HighscoreBoard from './HighscoreBoard';
import './HighscoreBoard.css';

import Confetti from 'react-confetti';

interface Tile {
  id: number;
  value: number;
}

const BoardSize = 4;

const App: React.FC = () => {
  const [board, setBoard] = useState<Tile[][]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    initBoard();
  }, []);

  const initBoard = () => {
    const newBoard: Tile[][] = Array.from({ length: BoardSize }, () =>
      Array.from({ length: BoardSize }, () => ({ id: 0, value: 0 }))
    );
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setIsGameOver(false);
    setHasWon(false);
  };

  const addRandomTile = (board: Tile[][]) => {
    const emptyTiles: { row: number; col: number }[] = [];
    for (let i = 0; i < BoardSize; i++) {
      for (let j = 0; j < BoardSize; j++) {
        if (board[i][j].value === 0) {
          emptyTiles.push({ row: i, col: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[row][col].value = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.preventDefault();
    let moved = false;
    switch (event.key) {
      case 'ArrowLeft':
        moved = moveLeft();
        break;
      case 'ArrowRight':
        moved = moveRight();
        break;
      case 'ArrowUp':
        moved = moveUp();
        break;
      case 'ArrowDown':
        moved = moveDown();
        break;
      default:
        break;
    }
    if (moved) {
      addRandomTile(board);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
    } else {
      checkGameOver();
    }
  };

  const moveLeft = (): boolean => {
    let moved = false;
    const newBoard = [...board];
    for (let i = 0; i < BoardSize; i++) {
      let lastMerged = -1;
      for (let j = 1; j < BoardSize; j++) {
        if (newBoard[i][j].value !== 0) {
          let k = j - 1;
          while (k > lastMerged && newBoard[i][k].value === 0) {
            k--;
          }
          if (k === -1 || newBoard[i][k].value !== newBoard[i][j].value) {
            k++;
          } else {
            newBoard[i][k].value *= 2;
            newBoard[i][j].value = 0;
            moved = true;
            lastMerged = k;
          }
          if (k !== j && lastMerged !== k) {
            newBoard[i][k].value = newBoard[i][j].value;
            newBoard[i][j].value = 0;
            moved = true;
          }
        }
      }
    }
    if (moved) {
      checkWinCondition(newBoard);
      setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: true }))));
      setTimeout(() => {
        setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: false }))));
      }, 200);
    }
    return moved;
  };

  const moveRight = (): boolean => {
    let moved = false;
    const newBoard = [...board];
    for (let i = 0; i < BoardSize; i++) {
      let lastMerged = BoardSize;
      for (let j = BoardSize - 2; j >= 0; j--) {
        if (newBoard[i][j].value !== 0) {
          let k = j + 1;
          while (k < lastMerged && newBoard[i][k].value === 0) {
            k++;
          }
          if (k === BoardSize || newBoard[i][k].value !== newBoard[i][j].value) {
            k--;
          } else {
            newBoard[i][k].value *= 2;
            newBoard[i][j].value = 0;
            moved = true;
            lastMerged = k;
          }
          if (k !== j && lastMerged !== k) {
            newBoard[i][k].value = newBoard[i][j].value;
            newBoard[i][j].value = 0;
            moved = true;
          }
        }
      }
    }
   if (moved) {
    setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: true }))));
    setTimeout(() => {
      setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: false }))));
    }, 200);
  }
    return moved;
  };

  const moveUp = (): boolean => {
    let moved = false;
    const newBoard = [...board];
    for (let j = 0; j < BoardSize; j++) {
      let lastMerged = BoardSize;
      for (let i = 1; i < BoardSize; i++) {
        if (newBoard[i][j].value !== 0) {
          let k = i - 1;
          while (k >= 0 && newBoard[k][j].value === 0) {
            k--;
          }
          if (k === -1 || newBoard[k][j].value !== newBoard[i][j].value) {
            k++;
          } else {
            newBoard[k][j].value *= 2;
            newBoard[i][j].value = 0;
            moved = true;
            lastMerged = k;
          }
          if (k !== i && lastMerged !== k)  {
            newBoard[k][j].value = newBoard[i][j].value;
            newBoard[i][j].value = 0;
            moved = true;
          }
        }
      }
    }
   if (moved) {
    setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: true }))));
    setTimeout(() => {
      setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: false }))));
    }, 200);
  }
    return moved;
  };

  const moveDown = (): boolean => {
    let moved = false;
    const newBoard = [...board];
    for (let j = 0; j < BoardSize; j++) {
      let lastMerged = -1;
      for (let i = BoardSize - 2; i >= 0; i--) {
        if (newBoard[i][j].value !== 0) {
          let k = i + 1;
          while (k < BoardSize && newBoard[k][j].value === 0) {
            k++;
          }
          if (k === BoardSize || newBoard[k][j].value !== newBoard[i][j].value) {
            k--;
          } else {
            newBoard[k][j].value *= 2;
            newBoard[i][j].value = 0;
            moved = true;
            lastMerged = k;
          }
          if (k !== i && lastMerged !== k) {
            newBoard[k][j].value = newBoard[i][j].value;
            newBoard[i][j].value = 0;
            moved = true;
          }
        }
      }
    }
   if (moved) {
    setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: true }))));
    setTimeout(() => {
      setBoard(newBoard.map(row => row.map(tile => ({ ...tile, isMoved: false }))));
    }, 200);
  }
    return moved;
  };

  const checkGameOver = () => {
    const hasEmptyTiles = board.some(row => row.some(tile => tile.value === 0));
    const hasAdjacentSameTiles = memoize(checkAdjacentSameTiles)(board);
  
    if (!hasEmptyTiles && !hasAdjacentSameTiles) {
      setIsGameOver(true);
    }
  };

  const checkAdjacentSameTiles = (board: Tile[][]): boolean => {
    for (let i = 0; i < BoardSize; i++) {
      for (let j = 0; j < BoardSize; j++) {
        if (board[i][j].value !== 0) {
          // Check right
          if (j < BoardSize - 1 && board[i][j].value === board[i][j + 1].value) {
            return true;
          }
          // Check down
          if (i < BoardSize - 1 && board[i][j].value === board[i + 1][j].value) {
            return true;
          }
        }
      }
    }
    return false;
  };
  
  
  const memoize = (fn: (board: Tile[][]) => boolean) => {
    const cache = new Map();
    return (board: Tile[][]) => {
      const key = JSON.stringify(board);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = fn(board);
      cache.set(key, result);
      return result;
    };
  };
  

  const checkWinCondition = (newBoard: Tile[][]) => {
    if (newBoard.some(row => row.some(tile => tile.value === 2048))) {
      setHasWon(true);
    }
  };

  const restartGame = () => {
    initBoard();
  };

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={0}>
      <HighscoreBoard highScore={highScore} />
      {hasWon && (
      <>
        <Confetti
          numberOfPieces={500}
          gravity={0.3}
          initialVelocityX={20}
          initialVelocityY={10}
          colors={['#FFD700', '#FF8C00', '#FF4500', '#FF0000']}
        />
        <VictoryMessage visible={hasWon} />
      </>
    )}
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((tile, colIndex) => (
              <div key={colIndex} className={`tile tile-${tile.value}`}>
                {tile.value !== 0 && tile.value}
              </div>
            ))}
          </div>
        ))}
      </div>
      <GameOverModal visible={isGameOver} onRestart={restartGame} />
    </div>
  );
};

export default App;
