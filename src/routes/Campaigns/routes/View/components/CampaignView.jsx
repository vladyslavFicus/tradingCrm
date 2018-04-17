import React, { Component } from 'react';
import Tabs from '../../../../../components/Tabs';
import { newBonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';

class CampaignView extends Component {
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
      <div className="layout layout_not-iframe">
        <div className="layout-info">
          <Header
            data={campaignData}
            activateMutation={activateMutation}
            cancelMutation={cancelMutation}
          />
          <div className="hide-details-block">
            <div className="hide-details-block_divider" />
          </div>
        </div>

        <div className="layout-content">
          <div className="nav-tabs-horizontal">
            <Tabs
              items={newBonusCampaignTabs}
              location={location}
              params={params}
            />
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignView;
