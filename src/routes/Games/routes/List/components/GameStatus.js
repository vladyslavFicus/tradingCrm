import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import renderLabel from '../../../../../utils/renderLabel';
import { gameStatus, gameStatusLabels, gameStatusColor } from '../../../../../constants/games';

const GameStatus = ({ status }) => {
  const gameStatuses = status.disabled ? gameStatus.INACTIVE : gameStatus.ACTIVE;

  return (
    <div className={classNames('font-weight-700 text-uppercase', gameStatusColor[gameStatuses])}>
      {renderLabel(gameStatuses, gameStatusLabels)}
    </div>
  );
};

GameStatus.propTypes = {
  status: PropTypes.object.isRequired,
};

export default GameStatus;
