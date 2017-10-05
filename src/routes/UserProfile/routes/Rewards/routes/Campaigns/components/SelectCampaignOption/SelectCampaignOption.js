import React from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import BonusCampaignStatus from '../../../../../../../../components/BonusCampaignStatus';
import Uuid from '../../../../../../../../components/Uuid';

const SelectCampaignOption = props => (
  <div className="row font-size-12" onClick={props.onClick}>
    <div className="col-sm-5">
      <div className="font-weight-700">
        {props.campaign.campaignName}
      </div>
      <div className="font-size-10">
        <Uuid uuid={props.campaign.uuid} uuidPrefix="CA" />
      </div>
    </div>
    <div className="col-sm-4">
      {moment.utc(props.campaign.startDate).local().format('DD.MM.YYYY HH:mm')}
      {' - '}
      {moment.utc(props.campaign.endDate).local().format('DD.MM.YYYY HH:mm')}
    </div>
    <div className="col-sm-3">
      <BonusCampaignStatus campaign={props.campaign} showAdditionalInfo={false} />
    </div>
  </div>
);

SelectCampaignOption.propTypes = {
  onClick: PropTypes.func.isRequired,
  campaign: PropTypes.bonusCampaignEntity.isRequired,
};

export default SelectCampaignOption;
