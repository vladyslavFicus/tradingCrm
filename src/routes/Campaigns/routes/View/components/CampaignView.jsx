import React, { PureComponent } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from '../../../../../router';
import Tabs from '../../../../../components/Tabs';
import { newBonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';
import Settings from '../routes/Settings';

class CampaignView extends PureComponent {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
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
      match: { params, path, url }, campaign: { campaign },
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
        <Switch>
          <Route path={`${path}/settings`} component={Settings} />
          <Redirect from={path} to={`${url}/settings`} />
        </Switch>
      </div>
    );
  }
}

export default CampaignView;
