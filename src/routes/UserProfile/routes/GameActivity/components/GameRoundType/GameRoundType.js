import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { typesLabels, typesProps } from './constants';
import renderLabel from '../../../../../../utils/renderLabel';
import './GameRoundType.scss';

class GameRoundType extends Component {
  static propTypes = {
    gameRound: PropTypes.shape({
      gameRoundType: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { gameRound } = this.props;
    const classNameType = typesProps[gameRound.gameRoundType];

    if (gameRound.gameRoundType === 'SPIN') {
      return null;
    }

    return (
      <div className={classNames('game-round-type', classNameType)}>
        {renderLabel(gameRound.gameRoundType, typesLabels)}
      </div>
    );
  }
}

export default GameRoundType;
