import React from 'react';
import './HighscoreBoard.css';

interface HighscoreBoardProps {
  highScore: number;
}

const HighscoreBoard: React.FC<HighscoreBoardProps> = ({ highScore }) => {
  return (
    <div className="highscore-board">
      <h2>Highscore</h2>
      <p>{highScore}</p>
    </div>
  );
};

export default HighscoreBoard;