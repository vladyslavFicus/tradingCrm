import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import Amount from '../../../../../../../../components/Amount';

const ViewModalStatistics = ({ freeSpin }) => (
  <div className="row well">
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_TITLE')}
      </div>

      <span className="font-weight-600 font-size-20 color-primary">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_GRANTED_COUNT', { count: freeSpin.freeSpinsAmount })}
      </span>
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_TOTAL_VALUE_TITLE')}
      </div>

      <Amount className="font-weight-600 font-size-20 color-primary" {...freeSpin.totalValue} />
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_TITLE')}
      </div>

      <span className="font-weight-600 font-size-20 color-primary">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_PLAYED_COUNT', { count: freeSpin.playedCount })}
      </span>
    </div>
    <div className="col-md-3 grey-back-tab">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATISTICS_WINNINGS_TITLE')}
      </div>

      <Amount className="font-weight-600 font-size-20 color-primary" {...freeSpin.winning} />
    </div>
  </div>
);

ViewModalStatistics.propTypes = {
  freeSpin: PropTypes.freeSpinEntity.isRequired,
};

export default ViewModalStatistics;
