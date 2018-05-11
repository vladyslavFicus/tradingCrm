import React, { PureComponent } from 'react';
import Tabs from '../../../../../components/Tabs';
import { newBonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';

class CampaignView extends PureComponent {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    campaign: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      campaign: PropTypes.shape({
        data: PropTypes.newBonusCampaignEntity.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const {
      location,
      params,
      children,
      campaign: { campaign },
      activateMutation,
      cancelMutation,
    } = this.props;

    if (!campaign) {
      return null;
    }

    const { data: campaignData } = campaign;

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={campaignData}
            activateMutation={activateMutation}
            cancelMutation={cancelMutation}
          />
          <hr />
        </div>
        <Tabs
          items={newBonusCampaignTabs}
          location={location}
          params={params}
        />
        {children}
      </div>
    );
  }
}

export default CampaignView;
