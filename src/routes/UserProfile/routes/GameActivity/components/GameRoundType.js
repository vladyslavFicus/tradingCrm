import React, { Component } from 'react';
import PropTypes from '../../../../../constants/propTypes';

class GameRoundType extends Component {
  static propTypes = {
    gameRound: PropTypes.shape({
      gameRoundType: PropTypes.string,
    }).isRequired,
  };

  render() {
    const { gameRound } = this.props;

    if (gameRound.gameRoundType === 'FREE_SPIN') {
      return (
        <div className="font-size-11 color-success font-weight-700">
          FREE SPIN
        </div>
      );
    } else if (gameRound.gameRoundType === 'BONUS_ROUND') {
      return (
        <div className="font-size-11 color-primary font-weight-700">
          BONUS ROUND
        </div>
      );
    } else if (gameRound.gameRoundType === 'SPORTBET') {
      return (
        <div className="font-size-11 color-primary font-weight-700">
          SPORTSBET
        </div>
      );
    } else if (gameRound.gameRoundType === 'OTHER') {
      return (
        <div className="font-size-11 color-primary font-weight-700">
          OTHER
        </div>
      );
    }

    return (
      <span>
        {this.renderGameRoundType}
      </span>
    );
  }
}

export default GameRoundType;
