import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';

class FreeSpinSettings extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };

  render() {
    const { freeSpin } = this.props;

    return (
      <div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.LINES')}
          {': '}
          <span className="font-weight-700">{freeSpin.linesPerSpin}</span>
        </div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.BET_PER_LINE')}
          {': '}
          <Amount className="font-weight-700" {...freeSpin.betPerLine} />
        </div>
        <div>
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_SETTINGS.SPIN_VALUE')}
          {': '}
          <Amount className="font-weight-700" {...freeSpin.spinValue} />
        </div>
      </div>
    );
  }
}

export default FreeSpinSettings;
