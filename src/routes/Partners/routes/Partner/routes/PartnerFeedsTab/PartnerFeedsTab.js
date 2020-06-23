import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PartnerFeedsFilterForm from './components/PartnerFeedsFilterForm';
import PartnerFeedsList from './components/PartnerFeedsList';
import './PartnerFeedsTab.scss';

class PartnerFeedsTab extends PureComponent {
  render() {
    return (
      <div className="PartnerFeedsTab">
        <div className="PartnerFeedsTab__header">
          <div className="PartnerFeedsTab__title">
            {I18n.t('PARTNER_PROFILE.FEED.TITLE')}
          </div>
        </div>

        <PartnerFeedsFilterForm />
        <PartnerFeedsList />
      </div>
    );
  }
}

export default PartnerFeedsTab;
