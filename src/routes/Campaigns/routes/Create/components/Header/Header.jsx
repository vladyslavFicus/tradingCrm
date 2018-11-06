import React from 'react';
import { I18n } from 'react-redux-i18n';

const Header = () => (
  <div className="panel-heading-row">
    <div className="panel-heading-row__info-title" id="campaign-name">
      {I18n.t('CAMPAIGNS.NEW_CAMPAIGN')}
    </div>
  </div>
);

export default Header;
