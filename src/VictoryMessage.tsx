import React from 'react';
import './VictoryMessage.css';

interface VictoryMessageProps {
  visible: boolean;
}

const VictoryMessage: React.FC<VictoryMessageProps> = ({ visible }) => {
  return visible ? (
    <div className="victory-message">
      <h1>Congratulations!</h1>
      <p>You've achieved the ultimate goal of 2048!</p>
      <p>Your skills are truly remarkable!</p>
    </div>
  ) : null;
};

export default VictoryMessage;