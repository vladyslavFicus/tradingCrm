import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { types, typesLabels, typesProps } from './constants';
import renderLabel from '../../../../../../utils/renderLabel';
import './GameRoundType.scss';

const GameRoundType = ({ gamingActivityEntity }) => {
  const className = typesProps[gamingActivityEntity.gameRoundType];

  if (gamingActivityEntity.gameRoundType === types.SPIN) {
    return null;
  }

  return (
    <div className={classNames('game-round-type', className)}>
      {renderLabel(gamingActivityEntity.gameRoundType, typesLabels)}
    </div>
  );
};

GameRoundType.propTypes = {
  gamingActivityEntity: PropTypes.shape({
    gameRoundType: PropTypes.string,
  }).isRequired,
};

export default GameRoundType;
