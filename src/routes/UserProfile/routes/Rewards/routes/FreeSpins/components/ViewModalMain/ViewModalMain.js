import React from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../../../../constants/propTypes';
import FreeSpinMainInfo from '../FreeSpinMainInfo';
import FreeSpinGameInfo from '../FreeSpinGameInfo';
import FreeSpinStatus from '../../../../../../../../components/FreeSpinStatus';

const ViewModalMain = ({ freeSpin }) => (
  <div className="modal-header-tabs">
    <div className="modal-header-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.FREE_SPIN')}
      </div>

      <FreeSpinMainInfo freeSpin={freeSpin} />
    </div>
    <div className="modal-header-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.PROVIDER_AND_GAME')}
      </div>

      <FreeSpinGameInfo freeSpin={freeSpin} />
    </div>
    <div className="modal-header-tabs__item">
      <div className="modal-tab-label">
        {I18n.t('PLAYER_PROFILE.FREE_SPINS.VIEW_MODAL.STATUS')}
      </div>

      <FreeSpinStatus id={`free-spin-status-${freeSpin.uuid}-view-modal`} freeSpin={freeSpin} />
    </div>
  </div>
);

ViewModalMain.propTypes = {
  freeSpin: PropTypes.freeSpinEntity.isRequired,
};

export default ViewModalMain;
