import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { SubmissionError } from 'redux-form';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../components/Uuid';
import renderLabel from '../../../../../../../../utils/renderLabel';
import {
  fulfilmentTypesLabels,
  statuses as bonusCampaignStatuses,
  targetTypesLabels,
} from '../../../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../../../components/IframeLink';
import SubTabNavigation from '../../../../../../../../components/SubTabNavigation';
import { routes as subTabRoutes } from '../../../../constants';
import CampaignsFilterForm from '../CampaignsFilterForm';
import ConfirmActionModal from '../../../../../../../../components/Modal/ConfirmActionModal';
import AddToCampaignModal from '../../../../../../../../components/AddToCampaignModal';
import AddPromoCodeModal from '../AddPromoCodeModal';
import PermissionContent from '../../../../../../../../components/PermissionContent';
import permissions from '../../../../../../../../config/permissions';

const CAMPAIGN_DECLINE_MODAL = 'campaign-decline-modal';
const ADD_TO_CAMPAIGN_MODAL = 'add-to-campaign-modal';
const ADD_PROMO_CODE_MODAL = 'add-promo-code-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusCampaignEntity).isRequired,
    profile: PropTypes.userProfile.isRequired,
    fetchPlayerCampaigns: PropTypes.func.isRequired,
    declineCampaign: PropTypes.func.isRequired,
    fetchCampaigns: PropTypes.func.isRequired,
    addPlayerToCampaign: PropTypes.func.isRequired,
    addPromoCodeToPlayer: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    modal: { ...modalInitialState },
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.handleRefresh();
    this.context.cacheChildrenComponent(this);
  }

  componentWillUnmount() {
    this.context.cacheChildrenComponent(null);
  }

  handleRefresh = () => {
    this.props.fetchPlayerCampaigns({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
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

  handleDeclineClick = (uuid, returnToList = false) => {
    this.handleOpenModal(CAMPAIGN_DECLINE_MODAL, { uuid, returnToList });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  handleDeclineCampaign = async () => {
    const { modal: { params: { uuid, returnToList } } } = this.state;

    const {
      declineCampaign,
      params: { id: playerUUID },
    } = this.props;

    const action = await declineCampaign(uuid, playerUUID, returnToList);
    this.handleCloseModal();

    if (action && !action.error) {
      this.handleRefresh();
    }
  };

  handleAddToCampaignClick = async () => {
    const { fetchCampaigns, params: { id }, profile: { currency } } = this.props;

    const currentPlayerCampaignsActions = await fetchCampaigns({ playerUUID: id });

    if (!currentPlayerCampaignsActions || currentPlayerCampaignsActions.error) {
      this.context.addNotification({
        level: 'error',
        title: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.TITLE'),
        message: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.MESSAGE'),
      });
    } else {
      const currentCampaigns = currentPlayerCampaignsActions.payload.content.map(i => i.id);

      const campaignsActions = await fetchCampaigns({ currency });

      if (!campaignsActions || campaignsActions.error) {
        this.context.addNotification({
          level: 'error',
          title: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.TITLE'),
          message: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FETCH_CAMPAIGNS_ERROR.MESSAGE'),
        });
      } else {
        this.handleOpenModal(ADD_TO_CAMPAIGN_MODAL, {
          campaigns: campaignsActions.payload.content
            .filter(i => currentCampaigns.indexOf(i.id) === -1 && i.currency === currency),
        });
      }
    }
  };

  handleAddToCampaign = async ({ campaignUuid }) => {
    const { params: { id }, addPlayerToCampaign } = this.props;

    const addPlayerToCampaignAction = await addPlayerToCampaign(campaignUuid, id);

    if (addPlayerToCampaignAction) {
      let level = 'success';
      let title = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PLAYER_TO_CAMPAIGN.TITLE');
      let message = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PLAYER_TO_CAMPAIGN.MESSAGE');

      if (addPlayerToCampaignAction.error) {
        level = 'error';
        title = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FAILURE_ADD_PLAYER_TO_CAMPAIGN.TITLE');
        message = I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.FAILURE_ADD_PLAYER_TO_CAMPAIGN.MESSAGE');
      }

      this.context.addNotification({
        level,
        title,
        message,
      });
    }

    this.handleCloseModal(this.handleRefresh);
  };

  handleAddPromoCode = async ({ promoCode }) => {
    const { params: { id }, addPromoCodeToPlayer } = this.props;
    const action = await addPromoCodeToPlayer(id, promoCode);

    if (!action || action.error) {
      throw new SubmissionError({ promoCode: I18n.t(action.payload.response.error) });
    } else {
      this.context.addNotification({
        level: 'success',
        title: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PROMO_CODE.TITLE'),
        message: I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOTIFICATIONS.SUCCESS_ADD_PROMO_CODE.MESSAGE'),
      });

      this.handleCloseModal(this.handleRefresh);
    }
  };

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.uuid}`}>
      <IframeLink
        className="font-weight-700 color-black"
        to={`/bonus-campaigns/view/${data.uuid}/settings`}
      >
        {data.campaignName}
      </IframeLink>
      <div className="font-size-10">
        {renderLabel(data.targetType, targetTypesLabels)}
      </div>
      <div className="font-size-10">
        <Uuid uuid={data.uuid} uuidPrefix="CA" />
      </div>
    </div>
  );

  renderBonusType = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {renderLabel(data.fulfilmentType, fulfilmentTypesLabels)}
      </div>
      <div className="font-size-10">{data.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}</div>
    </div>
  );

  renderAvailable = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.startDate).local().format('DD.MM.YYYY HH:mm')}
      </div>
      <div className="font-size-10">
        {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.DATE_TO', {
          time: moment.utc(data.endDate).local().format('DD.MM.YYYY HH:mm'),
        })}
      </div>
    </div>
  );

  renderOptInStatus = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {
          data.optedIn
            ? <span className="text-success">{I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPTED_IN')}</span>
            : I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.NOT_OPTED_IN')
        }
      </div>
      {
        data.optInDate &&
        <div className="font-size-10">
          {I18n.t('COMMON.DATE_ON', { date: moment.utc(data.optInDate).local().format('DD.MM.YYYY HH:mm') })}
        </div>
      }
    </div>
  );

  renderActions = (data) => {
    if (!data.optedIn || data.state !== bonusCampaignStatuses.ACTIVE) {
      return null;
    }

    return (
      <div className="text-center">
        <button
          key="optOutButton"
          type="button"
          className="btn btn-sm btn-danger margin-bottom-5"
          onClick={() => this.handleDeclineClick(data.uuid, true)}
        >
          {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPT_OUT')}
        </button>
        <button
          key="declineButton"
          type="button"
          className="btn btn-sm btn-danger display-inline"
          onClick={() => this.handleDeclineClick(data.uuid)}
        >
          {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.DECLINE')}
        </button>
      </div>
    );
  };

  render() {
    const { filters, modal } = this.state;
    const { list: { entities, noResults }, profile, locale } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div>
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="2">
          <div className="tab-header">
            <SubTabNavigation links={subTabRoutes} />
            <div className="tab-header__actions">
              <PermissionContent permissions={permissions.USER_PROFILE.ADD_TO_CAMPAIGN}>
                <button
                  className="btn btn-primary-outline margin-left-15 btn-sm"
                  onClick={this.handleAddToCampaignClick}
                >
                  {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.ADD_TO_CAMPAIGN_BUTTON')}
                </button>
              </PermissionContent>
              <PermissionContent permissions={permissions.USER_PROFILE.ADD_PROMO_CODE_TO_PLAYER}>
                <button
                  className="btn btn-primary-outline margin-left-15 btn-sm"
                  onClick={() => this.handleOpenModal(ADD_PROMO_CODE_MODAL)}
                >
                  {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.ADD_PROMO_CODE_BUTTON')}
                </button>
              </PermissionContent>
            </div>
          </div>
        </Sticky>

        <CampaignsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
        />
        <div className="tab-content">
          <GridView
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            locale={locale}
            showNoResults={noResults}
          >
            <GridColumn
              name="campaign"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
              render={this.renderCampaign}
            />

            <GridColumn
              name="available"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.AVAILABLE')}
              render={this.renderAvailable}
            />

            <GridColumn
              name="bonusType"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.BONUS_TYPE')}
              render={this.renderBonusType}
            />

            <GridColumn
              name="optInStatus"
              header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.OPT_IN_STATUS')}
              render={this.renderOptInStatus}
            />

            <GridColumn
              name="actions"
              header=""
              render={this.renderActions}
              headerStyle={{ width: '10%' }}
            />
          </GridView>
        </div>

        {
          modal.name === CAMPAIGN_DECLINE_MODAL &&
          <ConfirmActionModal
            onSubmit={this.handleDeclineCampaign}
            onClose={this.handleCloseModal}
          />
        }
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

export default View;
