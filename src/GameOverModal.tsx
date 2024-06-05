import React from 'react';
import './GameOverModal.css';

interface GameOverModalProps {
  visible: boolean;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ visible, onRestart }) => {
  return visible ? (
    <div className="game-over-modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>You've run out of moves! Would you like to restart?</p>
        <button onClick={onRestart}>Restart</button>
      </div>
    </div>
  ) : null;
};

export default GameOverModal;