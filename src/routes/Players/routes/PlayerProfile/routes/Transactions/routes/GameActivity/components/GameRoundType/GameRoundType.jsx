import React from 'react';
import classNames from 'classnames';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import { types, typesLabels, typesProps } from './constants';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import './GameRoundType.scss';

const GameRoundType = ({ gameRound }) => {
  const className = typesProps[gameRound.gameRoundType];

  if (gameRound.gameRoundType === types.SPIN) {
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
