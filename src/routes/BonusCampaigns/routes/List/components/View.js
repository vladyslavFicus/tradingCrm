import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import BonusCampaignsFilterForm from './BonusCampaignsFilterForm';
import PropTypes from '../../../../../constants/propTypes';
import Card, { Title, Content } from '../../../../../components/Card';
import GridView, { GridColumn } from '../../../../../components/GridView';
import renderLabel from '../../../../../utils/renderLabel';
import {
  fulfilmentTypesLabels,
  targetTypes,
  targetTypesLabels,
} from '../../../../../constants/bonus-campaigns';
import Amount from '../../../../../components/Amount';
import BonusCampaignStatus from '../../../../../components/BonusCampaignStatus';
import Uuid from '../../../../../components/Uuid';
import { types as miniProfileTypes } from '../../../../../constants/miniProfile';
import MiniProfile from '../../../../../components/MiniProfile';


class View extends Component {
  static propTypes = {
    campaigns: PropTypes.pageableState(PropTypes.bonusCampaignEntity).isRequired,
    types: PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.string).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
      error: PropTypes.object,
    }).isRequired,
    depositNumbers: PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.string).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
      error: PropTypes.object,
    }).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    locale: PropTypes.string.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    exportEntities: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    fetchDepositNumbers: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
  };

  static contextTypes = {
    addNotification: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentDidMount() {
    this.props.fetchTypes();
    this.handleRefresh();
  }

  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handlePageChanged = (page) => {
    if (!this.props.campaigns.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (filters.states) {
      filters.states = [filters.states];
    }

    this.setState({ filters, page: 0 }, this.handleRefresh);
  };

  handleFilterReset = () => {
    this.props.resetAll();
    this.setState({ filters: {}, page: 0 }, this.handleRefresh);
  };

  handleExport = () => this.props.exportEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.uuid}`}>
      <Link to={`/bonus-campaigns/view/${data.uuid}`} className="font-weight-700">{data.campaignName}</Link>
      <div className="font-size-11">
        <MiniProfile
          target={data.uuid}
          dataSource={data}
          type={miniProfileTypes.CAMPAIGN}
        >
          <Uuid uuid={data.uuid} uuidPrefix="CA" />
        </MiniProfile>
      </div>
      {
        data.authorUUID &&
        <div className="font-size-11">
          {I18n.t('COMMON.AUTHOR_BY')}
          <Uuid uuid={data.authorUUID} />
        </div>
      }
    </div>
  );

  renderType = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {renderLabel(data.targetType, targetTypesLabels)}
      </div>
      {
        data.targetType === targetTypes.TARGET_LIST &&
        <div>
          {
            data.optIn &&
            <div className="font-size-11">
              {I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.TOTAL_OPT_IN_PLAYERS', { count: data.totalOptInPlayers })}
            </div>
          }
          <div className="font-size-11">
            {I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.TOTAL_SELECTED_PLAYERS', { count: data.totalSelectedPlayers })}
          </div>
        </div>
      }
    </div>
  );

  renderFulfillmentType = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {renderLabel(data.fulfilmentType, fulfilmentTypesLabels)}
      </div>
      <div className="font-size-11">{data.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}</div>
    </div>
  );

  renderDate = field => (data) => {
    const date = moment.utc(data[field]).local();

    if (!data[field] || !date.isValid()) {
      return null;
    }

    return (
      <div>
        <div className="font-weight-700">
          {date.format('DD.MM.YYYY')}
        </div>
        <div className="font-size-11">
          {I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.DATE_TIME_AT', { time: date.format('HH:mm') })}
        </div>
      </div>
    );
  };

  renderGranted = data => (
    <div>
      <div className="font-weight-700">
        <Amount amount={data.grantedSum} currency={data.currency} />
      </div>
      <div className="font-size-11">
        {I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.GRANTED_TO', { count: data.grantedTotal })}
      </div>
    </div>
  );

  renderStatus = data => (
    <BonusCampaignStatus
      campaign={data}
    />
  );

  render() {
    const {
      fetchDepositNumbers,
      campaigns: { entities, exporting, noResults, isLoading },
      locale,
      types: { list },
      depositNumbers: { list: depositNumbers },
      statuses,
    } = this.props;
    const { filters } = this.state;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <Card>
        <Title>
          <span className="font-size-20 mr-auto" id="campaigns-page-title">
            {I18n.t('BONUS_CAMPAIGNS.TITLE')}
          </span>

          <button
            disabled={exporting || !allowActions}
            className="btn btn-default-outline margin-right-10"
            onClick={this.handleExport}
          >
            {I18n.t('COMMON.EXPORT')}
          </button>

          <Link
            className="btn btn-primary-outline"
            to="/bonus-campaigns/create"
          >
            {I18n.t('BONUS_CAMPAIGNS.BUTTON_CREATE_CAMPAIGN')}
          </Link>
        </Title>

        <BonusCampaignsFilterForm
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          fetchDepositNumbers={fetchDepositNumbers}
          disabled={!allowActions}
          types={list}
          depositNumbers={depositNumbers}
          statuses={statuses}
          locale={locale}
          isLoading={isLoading}
        />

        <Content>
          <GridView
            locale={locale}
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            showNoResults={noResults}
          >
            <GridColumn
              name="campaign"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
              render={this.renderCampaign}
            />

            <GridColumn
              name="targetType"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.TYPE')}
              render={this.renderType}
            />

            <GridColumn
              name="fulfillmentType"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.FULFILLMENT_TYPE')}
              render={this.renderFulfillmentType}
            />

            <GridColumn
              name="createdDate"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.CREATED')}
              render={this.renderDate('creationDate')}
            />

            <GridColumn
              name="startDate"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.START_DATE')}
              render={this.renderDate('startDate')}
            />

            <GridColumn
              name="endDate"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.END_DATE')}
              render={this.renderDate('endDate')}
            />

            <GridColumn
              name="granted"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.GRANTED')}
              render={this.renderGranted}
            />

            <GridColumn
              name="status"
              header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </Content>
      </Card>
    );
  }
}

export default View;
