import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import { gameRoundTypes } from '../../constants';
import { typesLabels, typesProps } from './constants';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import './GameRoundType.scss';

const GameRoundType = ({ gameRound }) => {
  const className = typesProps[gameRound.gameRoundType];

  if (gameRound.gameRoundType === gameRoundTypes.SPIN) {
    return null;
  }

  return (
    <div className={classNames('game-round-type', className)}>
      {renderLabel(gameRound.gameRoundType, typesLabels)}
    </div>
  );
};

GameRoundType.propTypes = {
  gameRound: PropTypes.gamingActivityEntity.isRequired,
};

export default GameRoundType;
