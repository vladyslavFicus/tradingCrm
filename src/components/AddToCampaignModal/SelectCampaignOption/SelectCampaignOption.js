import React from 'react';
import moment from 'moment';
import PropTypes from '../../../constants/propTypes';
import BonusCampaignStatus from '../../../components/BonusCampaignStatus';
import Uuid from '../../../components/Uuid';

const SelectCampaignOption = props => (
  <div className="row add-to-campaign-modal__campaign" onClick={props.onClick}>
    <div className="col-md-4">
      <div className="font-weight-700 add-to-campaign-modal__campaign-name">
        {props.campaign.name}
      </div>
      <div className="font-size-11">
        <Uuid uuid={props.campaign.uuid} uuidPrefix="CA" />
      </div>
    </div>
    <div className="col-md-6">
      {moment.utc(props.campaign.startDate).local().format('DD.MM.YYYY HH:mm')}
      {' - '}
      {moment.utc(props.campaign.endDate).local().format('DD.MM.YYYY HH:mm')}
    </div>
    <div className="col-md-2">
      <BonusCampaignStatus campaign={props.campaign} showAdditionalInfo={false} />
    </div>
  </div>
);

SelectCampaignOption.propTypes = {
  onClick: PropTypes.func,
  campaign: PropTypes.bonusCampaignEntity.isRequired,
};
SelectCampaignOption.defaultProps = {
  onClick: null,
};

export default SelectCampaignOption;
