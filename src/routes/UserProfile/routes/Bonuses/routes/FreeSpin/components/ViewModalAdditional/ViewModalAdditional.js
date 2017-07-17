import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import FreeSpinAvailablePeriod from '../FreeSpinAvailablePeriod';
import FreeSpinSettings from '../FreeSpinSettings';
import BonusSettings from '../BonusSettings';

const ViewModalAdditional = ({ freeSpin }) => (
  <div className="row player-header-blocks margin-bottom-20">
    <div className="col-md-4">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.AVAILABLE')}
      </div>

      <FreeSpinAvailablePeriod freeSpin={freeSpin} />
    </div>
    <div className="col-md-4">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.SPIN_SETTINGS')}
      </div>

      <FreeSpinSettings freeSpin={freeSpin} />
    </div>
    <div className="col-md-4">
      <div className="color-default text-uppercase font-size-11">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.BONUS_SETTINGS')}
      </div>

      <BonusSettings freeSpin={freeSpin} />
    </div>
  </div>
);

ViewModalAdditional.propTypes = {
  freeSpin: PropTypes.freeSpinEntity.isRequired,
};

export default ViewModalAdditional;
