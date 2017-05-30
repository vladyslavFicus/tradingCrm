import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import BonusCampaignsFilterForm from './BonusCampaignsFilterForm';
import PropTypes from '../../../../../constants/propTypes';
import Panel, { Title, Content } from '../../../../../components/Panel';
import GridView, { GridColumn } from '../../../../../components/GridView';
import renderLabel from '../../../../../utils/renderLabel';
import { campaignTypesLabels } from '../../../constants';
import Amount from '../../../../../components/Amount';
import BonusCampaignStatus from '../../../components/BonusCampaignStatus';
import Uuid from '../../../../../components/Uuid';
import CreateBonusCampaignModal from './CreateBonusCampaignModal';

const MODAL_CREATE_BONUS_CAMPAIGN = 'modal-create-bonus-campaign';
const defaultModalState = {
  name: null,
  params: {},
};

class View extends Component {
  static propTypes = {
    campaigns: PropTypes.pageableState(PropTypes.bonusCampaignEntity).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    types: PropTypes.shape({
      list: PropTypes.arrayOf(PropTypes.string).isRequired,
      isLoading: PropTypes.bool.isRequired,
      receivedAt: PropTypes.number,
      error: PropTypes.object,
    }).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
    locale: PropTypes.string.isRequired,
    fetchEntities: PropTypes.func.isRequired,
    createCampaign: PropTypes.func.isRequired,
    exportEntities: PropTypes.func.isRequired,
    fetchTypes: PropTypes.func.isRequired,
    resetAll: PropTypes.func.isRequired,
    router: PropTypes.object,
  };

  state = {
    filters: {},
    page: 0,
    modal: { ...defaultModalState },
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
    this.setState({ filters: {}, page: 0 });
  };

  handleOpenCreateModal = () => {
    this.setState({
      modal: {
        name: MODAL_CREATE_BONUS_CAMPAIGN,
        params: {},
      },
    });
  };

  handleCloseModal = (callback) => {
    this.setState({ modal: { ...defaultModalState } }, () => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  };

  handleSubmitNewBonusCampaign = async (data) => {
    const action = await this.props.createCampaign(data);

    if (action) {
      if (!action.error) {
        this.props.router.push(`/bonus-campaigns/view/${action.payload.campaignId}`);
      } else if (action.payload.response.fields_errors) {
        const errors = Object.keys(action.payload.response.fields_errors).reduce((res, name) => ({
          ...res,
          [name]: action.payload.response.fields_errors[name].error,
        }), {});
        throw new SubmissionError(errors);
      } else if (action.payload.response.error) {
        throw new SubmissionError({ __error: action.payload.response.error });
      }
    }

    return action;
  };

  handleExport = () => this.props.exportEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  renderCampaign = data => (
    <div id={`bonus-campaign-${data.campaignUUID}`}>
      <Link to={`/bonus-campaigns/view/${data.id}`} className="font-weight-700 color-black">{data.campaignName}</Link>
      <div className="font-size-10 text-uppercase">
        <Uuid uuid={data.campaignUUID} uuidPrefix="CO" />
      </div>
      {
        data.authorUUID &&
        <div className="font-size-10 text-uppercase">
          {I18n.t('COMMON.AUTHOR_BY')}
          <Uuid uuid={data.authorUUID} />
        </div>
      }
    </div>
  );

  renderFulfillmentType = data => (
    <div>
      <div className="text-uppercase font-weight-700">
        {renderLabel(data.campaignType, campaignTypesLabels)}
      </div>
      <div className="font-size-10">{data.optIn ? I18n.t('COMMON.OPT_IN') : I18n.t('COMMON.NON_OPT_IN')}</div>
    </div>
  );

  renderDate = field => (data) => {
    const date = moment.utc(data[field]);

    if (!data[field] || !date.isValid()) {
      return null;
    }

    return (
      <div>
        <div className="font-weight-700">
          {date.format('DD.MM.YYYY')}
        </div>
        <div className="font-size-10">
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
      <div className="font-size-10">
        {I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.GRANTED_TO', { count: data.grantedTotal })}
      </div>
    </div>
  );

  renderStatus = data => (
    <BonusCampaignStatus
      data={data}
    />
  );

  render() {
    const {
      campaigns: { entities, exporting },
      locale,
      types: { list },
      statuses,
      currencies,
    } = this.props;
    const { modal, filters } = this.state;
    const allowActions = Object.keys(filters).filter(i => filters[i]).length > 0;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <div className="row">
              <div className="col-md-3">
                <span className="font-size-20">{I18n.t('BONUS_CAMPAIGNS.TITLE')}</span>
              </div>
              <div className="col-md-3 col-md-offset-6 text-right">
                <button
                  disabled={exporting || !allowActions}
                  className="btn btn-default-outline margin-right-10"
                  onClick={this.handleExport}
                >
                  {I18n.t('COMMON.EXPORT')}
                </button>

                <button
                  className="btn btn-primary-outline"
                  onClick={this.handleOpenCreateModal}
                >
                  {I18n.t('BONUS_CAMPAIGNS.BUTTON_CREATE_CAMPAIGN')}
                </button>
              </div>
            </div>
          </Title>

          <BonusCampaignsFilterForm
            onSubmit={this.handleFiltersChanged}
            onReset={this.handleFilterReset}
            initialValues={filters}
            disabled={!allowActions}
            types={list}
            statuses={statuses}
            locale={locale}
          />

          <Content>
            <GridView
              locale={locale}
              tableClassName="table table-hovered data-grid-layout"
              headerClassName=""
              dataSource={entities.content}
              onPageChange={this.handlePageChanged}
              activePage={entities.number + 1}
              totalPages={entities.totalPages}
              lazyLoad
            >
              <GridColumn
                name="campaign"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
                headerClassName="text-uppercase"
                render={this.renderCampaign}
              />

              <GridColumn
                name="fulfillmentType"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.FULFILLMENT_TYPE')}
                headerClassName="text-uppercase"
                render={this.renderFulfillmentType}
              />

              <GridColumn
                name="createdDate"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.CREATED')}
                headerClassName="text-uppercase"
                render={this.renderDate('creationDate')}
              />

              <GridColumn
                name="startDate"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.START_DATE')}
                headerClassName="text-uppercase"
                render={this.renderDate('startDate')}
              />

              <GridColumn
                name="endDate"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.END_DATE')}
                headerClassName="text-uppercase"
                render={this.renderDate('endDate')}
              />

              <GridColumn
                name="granted"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.GRANTED')}
                headerClassName="text-uppercase"
                render={this.renderGranted}
              />

              <GridColumn
                name="status"
                header={I18n.t('BONUS_CAMPAIGNS.GRID_VIEW.STATUS')}
                headerClassName="text-uppercase"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>

        {
          modal.name === MODAL_CREATE_BONUS_CAMPAIGN &&
          <CreateBonusCampaignModal
            onSubmit={this.handleSubmitNewBonusCampaign}
            currencies={currencies}
            onClose={this.handleCloseModal}
            isOpen
          />
        }
      </div>
    );
  }
}

export default View;
