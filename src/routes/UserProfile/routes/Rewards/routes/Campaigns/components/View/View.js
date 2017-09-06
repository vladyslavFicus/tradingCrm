import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Sticky from 'react-stickynode';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../components/Uuid';
import renderLabel from '../../../../../../../../utils/renderLabel';
import {
  campaignTypesLabels, statuses as bonusCampaignStatuses,
  targetTypesLabels,
} from '../../../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../../../components/IframeLink';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import CampaignsFilterForm from '../CampaignsFilterForm';
import ConfirmActionModal from '../../../../../../../../components/Modal/ConfirmActionModal';

const CAMPAIGN_DECLINE_MODAL = 'campaign-decline-modal';
const modalInitialState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.bonusCampaignEntity).isRequired,
    fetchAvailableCampaignList: PropTypes.func.isRequired,
    declineCampaign: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    locale: PropTypes.string.isRequired,
  };
  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
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
    this.props.fetchAvailableCampaignList({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
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

  handleDeclineClick = (campaignId, returnToList = false) => {
    this.handleOpenModal(CAMPAIGN_DECLINE_MODAL, {
      campaignId,
      returnToList,
      onSubmit: this.handleDeclineCampaign,
    });
  };

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  handleDeclineCampaign = async () => {
    const { modal: { params: { campaignId, returnToList } } } = this.state;

    const {
      declineCampaign,
      params: { id: playerUUID },
    } = this.props;

    const action = await declineCampaign(campaignId, playerUUID, returnToList);
    this.handleCloseModal();

    if (action && !action.error) {
      this.handleRefresh();
    }
  };

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.uuid}`}>
      <IframeLink
        className="font-weight-700 color-black"
        to={`/bonus-campaigns/view/${data.id}/settings`}
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
        {renderLabel(data.campaignType, campaignTypesLabels)}
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
          onClick={() => this.handleDeclineClick(data.id, true)}
        >
          {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.OPT_OUT')}
        </button>
        <button
          key="declineButton"
          type="button"
          className="btn btn-sm btn-danger display-inline"
          onClick={() => this.handleDeclineClick(data.id)}
        >
          {I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.DECLINE')}
        </button>
      </div>
    );
  };

  render() {
    const { filters, modal } = this.state;
    const { list: { entities, noResults }, locale } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="profile-tab-container">
        <Sticky top=".panel-heading-row" bottomBoundary={0} innerZ="1">
          <div className="tab-header">
            <BonusHeaderNavigation />
          </div>
        </Sticky>

        <CampaignsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
        />
        <div className="tab-content">
          <GridView
            tableClassName="table table-hovered data-grid-layout"
            headerClassName="text-uppercase"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
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
            {...modal.params}
            form="confirmDeclineCampaign"
            onClose={this.handleCloseModal}
          />
        }

      </div>
    );
  }
}

export default View;
