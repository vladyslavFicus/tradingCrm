import React, { Component, Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import { get, uniq } from 'lodash';
import PropTypes from '../../../../../../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../../../components/Uuid';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import {
  statuses as bonusCampaignStatuses,
  targetTypesLabels,
  targetTypes,
} from '../../../../../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../../../../../components/IframeLink';
import CampaignsFilterForm from '../CampaignsFilterForm';
import AddToCampaignModal from '../../../../../../../../../../components/AddToCampaignModal';
import AddPromoCodeModal from '../AddPromoCodeModal';
import PermissionContent from '../../../../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../../../../config/permissions';
import Permissions from '../../../../../../../../../../utils/permissions';
import { sourceTypes, playerStatuses } from '../../../../../../../../../../constants/campaign-aggregator';
import ActionsDropDown from '../../../../../../../../../../components/ActionsDropDown';
import CountItems from '../CountItems';
import {
  deviceTypes as rewardDeviceTypes,
} from '../../../../../../../../../Campaigns/components/Rewards/constants';

const ADD_TO_CAMPAIGN_MODAL = 'add-to-campaign-modal';
const ADD_PROMO_CODE_MODAL = 'add-promo-code-modal';
const modalInitialState = {
  name: null,
  params: {},
};

const optInPermission = new Permissions([permissions.CAMPAIGN_AGGREGATOR.OPT_IN]);
const optOutPermission = new Permissions([permissions.CAMPAIGN_AGGREGATOR.OPT_OUT]);

class CampaignList extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusCampaignEntity).isRequired,
    profile: PropTypes.userProfile.isRequired,
    fetchPlayerCampaigns: PropTypes.func.isRequired,
    optOutCampaign: PropTypes.func.isRequired,
    optInCampaign: PropTypes.func.isRequired,
    addPlayerToCampaign: PropTypes.func.isRequired,
    deletePlayerFromCampaign: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    addPromoCodeToPlayer: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    locale: PropTypes.string.isRequired,
    modals: PropTypes.shape({
      confirmActionModal: PropTypes.modalType,
    }).isRequired,
  };
  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
    setRenderActions: PropTypes.func.isRequired,
    registerUpdateCacheListener: PropTypes.func.isRequired,
    unRegisterUpdateCacheListener: PropTypes.func.isRequired,
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentDidMount() {
    const {
      context: {
        registerUpdateCacheListener,
        setRenderActions,
      },
      constructor: { name },
      handleRefresh,
      handleAddToCampaignClick,
      handleOpenModal,
    } = this;

    handleRefresh();
    registerUpdateCacheListener(name, handleRefresh);
    setRenderActions(() => (
      <Fragment>
        <PermissionContent permissions={permissions.USER_PROFILE.ADD_TO_CAMPAIGN}>
          <button
            className="btn btn-primary-outline margin-left-15 btn-sm"
            onClick={handleAddToCampaignClick}
          >
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.ADD_TO_CAMPAIGN_BUTTON')}
          </button>
        </PermissionContent>
        <PermissionContent permissions={permissions.USER_PROFILE.ADD_PROMO_CODE_TO_PLAYER}>
          <button
            className="btn btn-primary-outline margin-left-15 btn-sm"
            onClick={() => handleOpenModal(ADD_PROMO_CODE_MODAL)}
          >
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.ADD_PROMO_CODE_BUTTON')}
          </button>
        </PermissionContent>
      </Fragment>
    ));
  }

  componentWillUnmount() {
    const {
      context: {
        unRegisterUpdateCacheListener,
        setRenderActions,
      },
      constructor: { name },
    } = this;

    setRenderActions(null);
    unRegisterUpdateCacheListener(name);
  }

  getCampaignUrl = (sourceType, uuid) => {
    if (sourceType === sourceTypes.PROMOTION) {
      return `/bonus-campaigns/view/${uuid}/settings`;
    } else if (sourceType === sourceTypes.CAMPAIGN) {
      return `/campaigns/view/${uuid}/settings`;
    }

    return null;
  };

  handleRefresh = () => {
    this.props.fetchPlayerCampaigns({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.match.params.id,
    });
  };

  handlePageChanged = (page) => {
    this.setState({ page: page - 1 }, this.handleRefresh);
  };

  handleOpenModal = (name, params) => {
    this.setState({
      modal: {
        name,
        params,
      },
    });
  };

  handleCloseModal = (cb) => {
    this.setState({ modal: { ...modalInitialState } }, () => {
      if (typeof cb === 'function') {
        cb();
      }
    });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  handleActionClick = (params) => {
    const { modals: { confirmActionModal } } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleActionCampaign(params),
    });
  };

  handleOptInClick = (params) => {
    const { rewards } = params;
    const {
      modals: {
        optInModal,
      },
    } = this.props;

    const uniqueDeviceTypes = uniq(rewards.map(i => i.type).filter(i => i !== rewardDeviceTypes.ALL));

    const deviceTypes = !uniqueDeviceTypes.length
      ? [rewardDeviceTypes.MOBILE, rewardDeviceTypes.DESKTOP]
      : uniqueDeviceTypes;

    optInModal.show({
      onSubmit: this.handleOptInCampaign(params),
      deviceTypes,
      initialValues: {
        deviceType: deviceTypes.length === 1 ? deviceTypes[0] : '',
      },
    });
  };

  handleOptInCampaign = params => async (formData) => {
    const {
      match: { params: { id: playerUUID } },
      modals: { optInModal },
      optInCampaign,
    } = this.props;

    const actionResult = await optInCampaign({ ...params, ...formData, playerUUID });

    if (actionResult && !actionResult.error) {
      optInModal.hide();
      this.handleRefresh();
    }
  };

  handleResetPlayerClick = uuid => () => {
    const { modals: { confirmActionModal } } = this.props;

    confirmActionModal.show({
      onSubmit: this.handleResetPlayer(uuid),
    });
  };

  handleResetPlayer = uuid => async () => {
    const {
      resetPlayer,
      profile: { playerUUID },
      modals: { confirmActionModal },
      notify,
    } = this.props;

    const response = await resetPlayer({
      variables: {
        campaignUUID: uuid,
        playerUUID,
      },
    });

    const error = get(response, 'data.campaign.resetPlayer.error');

    notify({
      level: error ? 'error' : 'success',
      title: I18n.t('BONUS_CAMPAIGNS.VIEW.NOTIFICATIONS.RESET_PLAYER'),
      message: `${error ? I18n.t('COMMON.ACTIONS.UNSUCCESSFULLY') : I18n.t('COMMON.ACTIONS.SUCCESSFULLY')}`,
    });

    confirmActionModal.hide();
  };

  handleActionCampaign = ({ action, ...params }) => async () => {
    const {
      match: { params: { id: playerUUID } },
      modals: { confirmActionModal },
    } = this.props;

    const actionResult = await action({ ...params, playerUUID });

    if (actionResult && !actionResult.error) {
      confirmActionModal.hide();
      this.handleRefresh();
    }
  };

  handleAddToCampaignClick = async () => {
    const { fetchCampaigns, match: { params: { id: playerUUID } } } = this.props;

    const campaignsActions = await fetchCampaigns(playerUUID);

    if (!campaignsActions || campaignsActions.error) {
      this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.TITLE'),
        message: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.MESSAGE'),
      });
    } else {
      this.handleOpenModal(ADD_TO_CAMPAIGN_MODAL, {
        campaigns: campaignsActions.payload.content,
      });
    }
  };

  handleAddToCampaign = async ({ campaign: { uuid, sourceType } }) => {
    const { match: { params: { id: playerUUID } }, addPlayerToCampaign } = this.props;

    console.log(`Add to campaign(uuid = ${uuid}, sourceType = ${sourceType}, playerUUID = ${playerUUID})`);

    const addPlayerToCampaignAction = await addPlayerToCampaign({ uuid, sourceType, playerUUID });

    console.log(`Add to campaign::result = ${addPlayerToCampaignAction}`);

    if (addPlayerToCampaignAction) {
      let level = 'success';
      let title = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PLAYER_TO_CAMPAIGN.TITLE');
      let message = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PLAYER_TO_CAMPAIGN.MESSAGE');

      if (addPlayerToCampaignAction.error) {
        level = 'error';
        title = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FAILURE_ADD_PLAYER_TO_CAMPAIGN.TITLE');
        message = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FAILURE_ADD_PLAYER_TO_CAMPAIGN.MESSAGE');
      }

      console.info('Add to campaign', level, title, message);

      this.context.addNotification({
        level,
        title,
        message,
      });
    }

    this.handleCloseModal(this.handleRefresh);
  };

  handleAddPromoCode = async ({ promoCode }) => {
    const { match: { params: { id: playerUUID } }, addPromoCodeToPlayer } = this.props;
    const action = await addPromoCodeToPlayer(playerUUID, promoCode);

    if (!action || action.error) {
      throw new SubmissionError({ promoCode: I18n.t(get(action, 'payload.response.error', 'error.internal')) });
    } else {
      this.context.addNotification({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PROMO_CODE.TITLE'),
        message: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PROMO_CODE.MESSAGE'),
      });

      this.handleCloseModal(this.handleRefresh);
    }
  };

  renderCampaign = ({ uuid, name, sourceType }) => (
    <div id={`bonus-campaign-${uuid}`}>
      <IframeLink
        className="font-weight-700 color-black"
        to={this.getCampaignUrl(sourceType, uuid)}
      >
        {name}
      </IframeLink>
      <div className="font-size-10">
        <Uuid uuid={uuid} />
      </div>
    </div>
  );

  renderAvailable = data => (
    <Fragment>
      <Choose>
        <When condition={data.startDate || data.endDate}>
          <Choose>
            <When condition={data.startDate}>
              <div className="font-weight-700">
                {moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm')}
              </div>
            </When>
            <Otherwise>-</Otherwise>
          </Choose>
          <div className="font-size-10">
            {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.DATE_TO', {
              time: data.endDate ? moment.utc(data.endDate).local().format('DD.MM.YYYY HH:mm') : '-',
            })}
          </div>
        </When>
        <Otherwise>{I18n.t('COMMON.PERMANENT')}</Otherwise>
      </Choose>
    </Fragment>
  );

  renderTargetType = ({ targetType, optIn }) => (
    <Fragment>
      <div className="font-weight-700 color-black">
        {renderLabel(targetType, targetTypesLabels)}
      </div>
      <div className="font-size-10">{optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}</div>
    </Fragment>
  );

  renderPlayerStatus = ({ playerStatus, optInDate }) => (
    <Fragment>
      <div className="text-uppercase font-weight-700">
        <Choose>
          <When condition={playerStatus === playerStatuses.OPT_IN}>
            <span className="text-success">{I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPTED_IN')}</span>
          </When>
          <Otherwise>
            <div className="color-default">
              {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPT_IN_NOT_REQUIRED')}
            </div>
          </Otherwise>
        </Choose>
      </div>
      <If condition={optInDate}>
        <div className="font-size-10">
          {I18n.t('COMMON.DATE_ON', { date: moment.utc(optInDate).local().format('DD.MM.YYYY HH:mm') })}
        </div>
      </If>
    </Fragment>
  );

  renderFulfillments = ({ fulfillments }) => (
    <div className="font-weight-700 color-black">
      <Choose>
        <When condition={fulfillments.length === 0}>
          {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.FULFILLMENT.NO_FULFILLMENT')}
        </When>
        <Otherwise>
          <CountItems
            items={fulfillments}
            prefixOptions={{
              'DEPOSIT-FULFILLMENT': I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.FULFILLMENT.DEPOSIT'),
              'WAGERING-FULFILLMENT': I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.FULFILLMENT.WAGERING'),
              'PROFILE-COMPLETION-FULFILLMENT': I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.FULFILLMENT.PROFILE_COMPLETION'),
            }}
          />
        </Otherwise>
      </Choose>
    </div>
  );

  renderRewards = ({ rewards }) => (
    <div className="font-weight-700 color-black">
      <CountItems
        items={rewards.map(item => item.uuid)}
        prefixOptions={{
          'BONUS-TPL': I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.REWARDS.BONUS'),
          'FREE-SPIN-TPL': I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.REWARDS.FREE_SPIN'),
        }}
      />
    </div>
  );

  renderActions = (params) => {
    const {
      state,
      playerStatus,
      uuid,
      targetType,
      sourceType: originalSourceType,
      rewards,
      optIn,
    } = params;

    const { permissions: currentPermissions } = this.context;

    const {
      optOutCampaign,
      deletePlayerFromCampaign,
    } = this.props;
    const items = [];
    const sourceType = originalSourceType ? originalSourceType.toLowerCase() : null;

    if (state !== bonusCampaignStatuses.ACTIVE) {
      return null;
    }

    if (playerStatus === playerStatuses.OPT_IN) {
      items.push({
        label: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPT_OUT'),
        onClick: () => this.handleActionClick({
          action: optOutCampaign,
          uuid,
          returnToList: true,
        }),
        visible: optOutPermission.check(currentPermissions),
      }, {
        label: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.DECLINE'),
        onClick: () => this.handleActionClick({
          action: optOutCampaign,
          uuid,
        }),
        visible: optOutPermission.check(currentPermissions),
      });
    } else {
      items.push({
        label: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.UN_TARGET'),
        onClick: () => this.handleActionClick({
          action: deletePlayerFromCampaign,
          uuid,
          sourceType,
        }),
        visible: targetType !== targetTypes.ALL,
      });

      items.push({
        label: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPT_IN'),
        onClick: () => this.handleOptInClick({
          uuid,
          rewards,
        }),
        visible: optInPermission.check(currentPermissions) && optIn,
      });
    }

    items.push({
      label: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.RESET_PLAYER'),
      onClick: this.handleResetPlayerClick(uuid),
      visible: originalSourceType === sourceTypes.CAMPAIGN,
    });

    return <ActionsDropDown items={items} />;
  };

  render() {
    const { filters, modal } = this.state;

    const {
      list: { entities, noResults },
      profile,
      locale,
    } = this.props;

    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div>
        <CampaignsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
        />
        <div className="tab-wrapper">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
          >
            <GridViewColumn
              name="campaign"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
              render={this.renderCampaign}
            />

            <GridViewColumn
              name="available"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.AVAILABLE')}
              render={this.renderAvailable}
            />

            <GridViewColumn
              name="targetType"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.TARGET_TYPE')}
              render={this.renderTargetType}
            />

            <GridViewColumn
              name="fulfillments"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.FULFILLMENTS')}
              render={this.renderFulfillments}
            />

            <GridViewColumn
              name="rewards"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.REWARDS')}
              render={this.renderRewards}
            />

            <GridViewColumn
              name="playerStatus"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.PLAYER_STATUS')}
              render={this.renderPlayerStatus}
            />

            <GridViewColumn
              name="actions"
              header=""
              render={this.renderActions}
            />
          </GridView>
        </div>
        {
          modal.name === ADD_TO_CAMPAIGN_MODAL &&
          <AddToCampaignModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onSubmit={this.handleAddToCampaign}
            title={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.TITLE')}
            message={
              I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.MODALS.ADD_TO_CAMPAIGN.ACTION', {
                fullName: profile.fullName,
              })
            }
          />
        }
        {
          modal.name === ADD_PROMO_CODE_MODAL &&
          <AddPromoCodeModal
            {...modal.params}
            onClose={this.handleCloseModal}
            onSubmit={this.handleAddPromoCode}
            fullName={profile.fullName}
          />
        }
      </div>
    );
  }
}

export default CampaignList;
