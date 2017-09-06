import React from 'react';
import PropTypes from 'prop-types';
import './GameRoundType.scss';

const GameRoundType = ({ gameRound }) => (
  <div className="game-round-type">test</div>
);

GameRoundType.propTypes = {
  gameRound: PropTypes.shape({
    gameRoundType: PropTypes.string,
  }).isRequired,
};

export default GameRoundType;
