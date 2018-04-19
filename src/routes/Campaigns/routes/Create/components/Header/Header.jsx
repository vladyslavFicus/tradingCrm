import React from 'react';
import { I18n } from 'react-redux-i18n';
import { statuses } from '../../../../../../constants/bonus-campaigns';

const Header = () => (
  <div>
    <div className="panel-heading-row">
      <div className="panel-heading-row__info">
        <div className="panel-heading-row__info-title" id="campaign-name">
          {I18n.t('CAMPAIGNS.NEW_CAMPAIGN')}
        </div>
        <div className="panel-heading-row__info-ids">
          <span className="short__uuid">
            <span className="copy-clipboard-container">{I18n.t('CAMPAIGNS.SAVE_NEW_CAMPAIGN')}</span>
          </span>
        </div>
      </div>
    </div>
    <div className="layout-quick-overview">
      <div className="header-block">
        <div className="header-block-title">
          {I18n.t('CAMPAIGNS.STATUS_DROPDOWN.TITLE')}
        </div>
        <div className="bonus-campaign-status__status color-black">
          {I18n.t(statuses.DRAFT)}
        </div>
      </div>
    </div>
  </div>
);

export default Header;
