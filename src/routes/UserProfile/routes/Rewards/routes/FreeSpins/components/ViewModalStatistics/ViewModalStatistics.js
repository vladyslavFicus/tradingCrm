import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';

const ViewModalStatistics = ({ freeSpin }) => (
  <div className="modal-footer-tabs modal-footer-tabs_justified-around">
    <div className="modal-footer-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_TITLE')}
      </div>

      <span className="modal-footer-tabs__amount">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_COUNT', { count: freeSpin.freeSpinsAmount })}
      </span>
    </div>
    <div className="modal-footer-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_TOTAL_VALUE_TITLE')}
      </div>

      <Amount className="modal-footer-tabs__amount" {...freeSpin.totalValue} />
    </div>
    <div className="modal-footer-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_TITLE')}
      </div>

      <span className="modal-footer-tabs__amount">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_COUNT', { count: freeSpin.playedCount })}
      </span>
    </div>
    <div className="modal-footer-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_WINNINGS_TITLE')}
      </div>

      <Amount className="modal-footer-tabs__amount" {...freeSpin.winning} />
    </div>
  </div>
);

ViewModalStatistics.propTypes = {
  freeSpin: PropTypes.freeSpinEntity.isRequired,
};

export default ViewModalStatistics;
