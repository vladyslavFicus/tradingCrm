import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import LeadFeedsFilterForm from './components/LeadFeedsFilterForm';
import LeadFeedsList from './components/LeadFeedsList';
import './LeadFeedsTab.scss';

class LeadFeedsTab extends PureComponent {
  render() {
    return (
      <div className="LeadFeedsTab">
        <div className="LeadFeedsTab__header">
          <div className="LeadFeedsTab__title">
            {I18n.t('LEAD_PROFILE.FEED.TITLE')}
          </div>
        </div>

        <LeadFeedsFilterForm />
        <LeadFeedsList />
      </div>
    );
  }
}

export default LeadFeedsTab;
