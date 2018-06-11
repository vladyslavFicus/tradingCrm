import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../../../components/Amount';

class ViewModalStatistics extends Component {
  static propTypes = {
    freeSpin: PropTypes.freeSpinEntity.isRequired,
  };

  render() {
    const {
      freeSpin: {
        freeSpinsAmount, playedCount, winning, betPrice, linesPerSpin, currencyCode,
      },
    } = this.props;

    const totalValue = {
      amount: betPrice * linesPerSpin * freeSpinsAmount,
      currency: currencyCode,
    };

    return (
      <div className="modal-footer-tabs modal-footer-tabs_justified-around">
        <div className="modal-footer-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_TITLE')}
          </div>
          <span className="modal-footer-tabs__amount">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_COUNT', { count: freeSpinsAmount })}
          </span>
        </div>
        <div className="modal-footer-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_TOTAL_VALUE_TITLE')}
          </div>
          <Amount className="modal-footer-tabs__amount" {...totalValue} />
        </div>
        <div className="modal-footer-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_TITLE')}
          </div>
          <span className="modal-footer-tabs__amount">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_COUNT', { count: playedCount })}
          </span>
        </div>
        <div className="modal-footer-tabs__item">
          <div className="modal-tab-label">
            {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_WINNINGS_TITLE')}
          </div>
          <Amount className="modal-footer-tabs__amount" {...winning} />
        </div>
      </div>
    );
  }
}

export default ViewModalStatistics;
