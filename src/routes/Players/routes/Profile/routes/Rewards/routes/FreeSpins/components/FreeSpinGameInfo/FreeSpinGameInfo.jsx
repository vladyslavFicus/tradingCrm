import React, { PureComponent } from 'react';
import PropTypes from '../../../../../../../../../../constants/propTypes';

class FreeSpinGameInfo extends PureComponent {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };

  render() {
    const { freeSpin } = this.props;

    return (
      <div>
        <div className="font-weight-700">
          {freeSpin.providerId}
        </div>
        <div className="font-size-11">
          {freeSpin.gameName || freeSpin.gameId}
        </div>
      </div>
    );
  }
}

export default FreeSpinGameInfo;
