import React from 'react';
import { I18n } from 'react-redux-i18n';

const Volume = () => (
  <div className="limits-info_tab">
    <div className="limits-info_tab-content">
      <div className="header-block_player-limits-tab_status">
        <span className="header-block-title">{I18n.t('CLIENT_PROFILE.PROFILE.HEADER.TRADING_VOLUME')}</span>
      </div>
    </div>
  </div>
);

export default Volume;
