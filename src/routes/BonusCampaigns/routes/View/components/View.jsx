import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { Switch, Redirect } from 'react-router-dom';
import { Route } from '../../../../../router';
import Tabs from '../../../../../components/Tabs';
import { bonusCampaignTabs } from '../../../../../config/menu';
import PropTypes from '../../../../../constants/propTypes';
import Header from '../components/Header';
import Information from '../components/Information';
import HideDetails from '../../../../../components/HideDetails';
import NotFound from '../../../../../routes/NotFound';
import history from '../../../../../router/history';
import Settings from '../routes/Settings';
import Feed from '../routes/Feed';

class ViewLayout extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    data: PropTypes.bonusCampaignEntity.isRequired,
    availableStatusActions: PropTypes.arrayOf(PropTypes.object),
    onChangeCampaignState: PropTypes.func.isRequired,
    cloneCampaign: PropTypes.func.isRequired,
    uploadFile: PropTypes.func.isRequired,
    removeAllPlayers: PropTypes.func.isRequired,
    error: PropTypes.any,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
    notify: PropTypes.func.isRequired,
  };

  static defaultProps = {
    availableStatusActions: [],
    error: null,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  componentDidMount() {
    const { match: { params: { id } }, fetchCampaign } = this.props;
    fetchCampaign(id);
  }

  handleUploadFile = async (errors, file) => {
    const {
      match: { params: { id: uuid } },
      uploadFile,
      notify,
    } = this.props;

    const action = await uploadFile(uuid, file);

    if (action) {
      notify({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.ADD_PLAYERS'),
        message: `${I18n.t('COMMON.ACTIONS.UPLOADED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
    }
  };

  handleCloneCampaign = async (uuid) => {
    const { notify, cloneCampaign } = this.props;

    const action = await cloneCampaign(uuid);

    if (action) {
      notify({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.CAMPAIGN_COPIED'),
        message: `${I18n.t('COMMON.NOTIFICATIONS.COPIED')} ${action.error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') :
          I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
      });
      if (!action.error) {
        history.push(`/bonus-campaigns/view/${action.payload.campaignUUID}/settings`);
      }
    }
  };

  handleRemovePlayersClick = () => {
    const {
      match: { params: { id: uuid } },
      modals: { confirmActionModal },
    } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleRemovePlayers(uuid),
      modalTitle: I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.BUTTON'),
      actionText: I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.MODAL_TEXT'),
    });
  };

  handleRemovePlayers = uuid => async () => {
    const { modals: { confirmActionModal } } = this.state;
    const { removeAllPlayers, notify } = this.props;

    const action = await removeAllPlayers(uuid);

    if (action) {
      confirmActionModal.hide();

      notify({
        level: action.error ? 'error' : 'success',
        title: I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.BUTTON'),
        message: action.error ? I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.ERROR_NOTIFICATION') :
          I18n.t('BONUS_CAMPAIGNS.REMOVE_PLAYERS.SUCCESS_NOTIFICATION'),
      });
    }
  };

  render() {
    const {
      data: bonusCampaignData,
      location,
      match: { params, path, url },
      availableStatusActions,
      error,
      onChangeCampaignState,
    } = this.props;

    if (!bonusCampaignData.uuid && error) {
      return <NotFound />;
    }

    if (!bonusCampaignData.uuid) {
      return null;
    }

    return (
      <div className="profile">
        <div className="profile__info">
          <Header
            onChangeCampaignState={onChangeCampaignState}
            availableStatusActions={availableStatusActions}
            data={bonusCampaignData}
            onUpload={this.handleUploadFile}
            cloneCampaign={this.handleCloneCampaign}
            removeAllPlayers={this.handleRemovePlayersClick}
          />
          <HideDetails>
            <Information data={bonusCampaignData} />
          </HideDetails>
        </div>
        <Tabs
          items={bonusCampaignTabs}
          location={location}
          params={params}
        />
        <Switch>
          <Route path={`${path}/settings`} component={Settings} />
          <Route path={`${path}/feed`} component={Feed} />
          <Redirect to={`${url}/settings`} />
        </Switch>
      </div>
    );
  }
}

export default ViewLayout;
