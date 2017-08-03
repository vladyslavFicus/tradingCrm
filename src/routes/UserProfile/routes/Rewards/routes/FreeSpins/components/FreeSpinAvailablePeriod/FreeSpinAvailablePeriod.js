import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';

class FreeSpinAvailablePeriod extends Component {
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
          {moment.utc(freeSpin.startDate).local().format('DD.MM.YYYY HH:mm')}
        </div>
        <div className="font-size-11">
          {I18n.t('PLAYER_PROFILE.FREE_SPINS.FREE_SPIN_AVAILABLE_PERIOD.DATE_TO', {
            time: moment.utc(freeSpin.endDate).local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </div>
    );
  }
}

export default FreeSpinAvailablePeriod;
