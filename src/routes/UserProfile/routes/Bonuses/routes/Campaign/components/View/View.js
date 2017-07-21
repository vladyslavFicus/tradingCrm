import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import PropTypes from '../../../../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../../../../components/GridView';
import Uuid from '../../../../../../../../components/Uuid';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { campaignTypesLabels, targetTypesLabels } from '../../../../../../../../constants/bonus-campaigns';
import IframeLink from '../../../../../../../../components/IframeLink';
import BonusHeaderNavigation from '../../../../components/BonusHeaderNavigation';
import CampaignsFilterForm from '../CampaignsFilterForm';

class View extends Component {
  static propTypes = {
    list: PropTypes.pageableState(PropTypes.shape({
      authorUUID: PropTypes.string.isRequired,
      bonusLifetime: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      campaignPriority: PropTypes.number.isRequired,
      campaignRatio: PropTypes.customValue.isRequired,
      uuid: PropTypes.string.isRequired,
      capping: PropTypes.customValue,
      conversionPrize: PropTypes.customValue,
      creationDate: PropTypes.string.isRequired,
      currency: PropTypes.string.isRequired,
      grantedSum: PropTypes.number.isRequired,
      grantedTotal: PropTypes.number.isRequired,
      endDate: PropTypes.string.isRequired,
      campaignType: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      optIn: PropTypes.bool.isRequired,
      optedIn: PropTypes.bool.isRequired,
      optInDate: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      stateReason: PropTypes.string,
      statusChangedDate: PropTypes.string,
      targetType: PropTypes.string.isRequired,
      wagerWinMultiplier: PropTypes.number.isRequired,
    })).isRequired,
    fetchAvailableCampaignList: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  };
  static contextTypes = {
    cacheChildrenComponent: PropTypes.func.isRequired,
  };

  state = {
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

  handleFiltersChanged = (filters = {}) => {
    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.uuid}`}>
      <IframeLink
        className="font-weight-700 color-black"
        to={`/bonus-campaigns/view/${data.id}/settings`}
      >
        {data.name}
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
          {I18n.t('COMMON.DATE_ON', { date: data.optInDate })}
        </div>
      }
    </div>
  );

  render() {
    const { filters } = this.state;
    const { list: { entities } } = this.props;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="tab-pane fade in active profile-tab-container">
        <div className="row margin-bottom-20">
          <div className="col-md-6 col-xs-6">
            <BonusHeaderNavigation />
          </div>
        </div>

        <CampaignsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
        />

        <GridView
          tableClassName="table table-hovered data-grid-layout"
          headerClassName=""
          dataSource={entities.content}
          onPageChange={this.handlePageChanged}
          activePage={entities.number + 1}
          totalPages={entities.totalPages}
        >
          <GridColumn
            name="campaign"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
            headerClassName="text-uppercase"
            render={this.renderCampaign}
          />

          <GridColumn
            name="available"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.AVAILABLE')}
            headerClassName="text-uppercase"
            render={this.renderAvailable}
          />

          <GridColumn
            name="bonusType"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.BONUS_TYPE')}
            headerClassName="text-uppercase"
            render={this.renderBonusType}
          />

          <GridColumn
            name="optInStatus"
            header={I18n.t('PLAYER_PROFILE.BONUS_CAMPAIGNS.GRID_VIEW.OPT_IN_STATUS')}
            headerClassName="text-uppercase"
            render={this.renderOptInStatus}
          />
        </GridView>
      </div>
    );
  }
}

export default View;
