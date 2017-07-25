import React, { Component } from 'react';
import PropTypes from '../../../../../../../../constants/propTypes';

class FreeSpinGameInfo extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };
  static defaultProps = {
    onClick: null,
  };

  render() {
    const { freeSpin } = this.props;

    return (
      <div>
        <div className="font-weight-700">
          {freeSpin.providerId}
        </div>
        <div className="font-size-10">
          {freeSpin.gameName || freeSpin.gameId}
        </div>
      </div>
    );
  }
}

export default FreeSpinGameInfo;
