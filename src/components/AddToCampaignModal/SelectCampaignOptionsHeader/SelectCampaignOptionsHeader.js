import React from 'react';
import { I18n } from 'react-redux-i18n';

const SelectCampaignOptionsHeader = () => (
  <div className="row add-to-campaign-modal__titles">
    <div className="col-md-4">
      {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.CAMPAIGN')}
    </div>
    <div className="col-md-6">
      {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.AVAILABILITY')}
    </div>
    <div className="col-md-2">
      {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.STATUS')}
    </div>
  </div>
);

export default SelectCampaignOptionsHeader;
