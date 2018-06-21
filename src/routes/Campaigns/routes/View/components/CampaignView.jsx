import React, { PureComponent } from 'react';
import { get } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from '../../../../../router';
import Tabs from '../../../../../components/Tabs';
import { newBonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from './Header';
import Settings from '../routes/Settings';
import history from '../../../../../router/history';
import NotFound from '../../../../../routes/NotFound';

class CampaignView extends PureComponent {
  static propTypes = {
    activateMutation: PropTypes.func.isRequired,
    cancelMutation: PropTypes.func.isRequired,
    uploadPlayersFile: PropTypes.func.isRequired,
    removeAllPlayers: PropTypes.func.isRequired,
    cloneMutation: PropTypes.func.isRequired,
    uploadResetPlayersFile: PropTypes.func.isRequired,
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
        data: PropTypes.newBonusCampaignEntity,
      }),
    }).isRequired,
  };

  handleCloneCampaign = async () => {
    const {
      campaign: {
        campaign: {
          data: {
            uuid,
          },
        },
      },
      cloneMutation,
      notify,
    } = this.props;

    const response = await cloneMutation({ variables: { uuid } });
    const clone = get(response, 'data.campaign.clone');

    if (clone) {
      notify({
        level: clone.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.CAMPAIGN_COPIED'),
        message: `${I18n.t('COMMON.NOTIFICATIONS.COPIED')} ${clone.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });

      if (!clone.error) {
        const campaignUUID = get(clone, 'data.uuid');
        history.push(`/campaigns/view/${campaignUUID}/settings`);
      }
    }
  };

  render() {
    const {
      location,
      match: { params, path, url }, campaign: { campaign },
      activateMutation,
      cancelMutation,
      uploadPlayersFile,
      uploadResetPlayersFile,
      removeAllPlayers,
    } = this.props;

    if (!campaign) {
      return null;
    }

    if (campaign.error) {
      return <NotFound />;
    }

    const { data: campaignData } = campaign;

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            data={campaignData}
            activateMutation={activateMutation}
            cancelMutation={cancelMutation}
            uploadPlayersFile={uploadPlayersFile}
            uploadResetPlayersFile={uploadResetPlayersFile}
            removeAllPlayers={removeAllPlayers}
            cloneCampaign={this.handleCloneCampaign}
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
          <Redirect to={`${url}/settings`} />
        </Switch>
      </div>
    );
  }
}

export default CampaignView;
