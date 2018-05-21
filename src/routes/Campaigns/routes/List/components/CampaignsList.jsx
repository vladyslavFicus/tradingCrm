import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import history from '../../../../../router/history';
import Uuid from '../../../../../components/Uuid';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
import BonusCampaignStatus from '../../../../../components/BonusCampaignStatus';
import CampaignGridViewFilter from './CampaignGridViewFilter';
import ShortLoader from '../../../../../components/ShortLoader';

class CampaignsList extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    campaigns: PropTypes.shape({
      refetch: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loadMoreCampaigns: PropTypes.func.isRequired,
      campaigns: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.newBonusCampaignEntity),
      }),
    }).isRequired,
  };

  handleFiltersChanged = (filters = {}) => history.replace({ query: { filters } });

  handleFilterReset = () => history.replace({ query: { filters: {} } });

  handlePageChanged = () => {
    const {
      campaigns: {
        loadMoreCampaigns,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMoreCampaigns();
    }
  };

  renderCampaign = data => (
    <div>
      <Link to={`/campaigns/view/${data.uuid}/settings`} className="font-weight-700">{data.name}</Link>
      <div className="font-size-11">
        <Uuid length={20} uuid={data.uuid} uuidPrefix="CA" />
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

  renderStatus = data => (
    <BonusCampaignStatus
      campaign={data}
      showAdditionalInfo={false}
    />
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
          {I18n.t('CAMPAIGNS.GRID_VIEW.DATE_TIME_AT', { time: date.format('HH:mm') })}
        </div>
      </div>
    );
  };

  render() {
    const {
      location: { query },
      campaigns: { campaigns, loading, variables: { size, page, ...filters } },
      locale,
    } = this.props;
    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <span className="font-size-20 mr-auto" id="campaigns-page-title">
            {I18n.t('CAMPAIGNS.TITLE')}
          </span>
          <Link
            className="btn btn-primary-outline"
            to="/campaigns/create"
          >
            {I18n.t('CAMPAIGNS.BUTTON_CREATE_CAMPAIGN')}
          </Link>
        </div>

        <CampaignGridViewFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={filters}
          disabled={!allowActions || loading}
        />

        <div className="card-body">
          <Choose>
            <When condition={loading}>
              <ShortLoader />
            </When>
            <Otherwise>
              <GridView
                locale={locale}
                dataSource={campaigns.content}
                onPageChange={this.handlePageChanged}
                activePage={campaigns.number + 1}
                totalPages={campaigns.totalPages}
                showNoResults={false}
                last={campaigns.last}
                lazyLoad
              >
                <GridViewColumn
                  name="campaign"
                  header={I18n.t('CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
                  render={this.renderCampaign}
                />
                <GridViewColumn
                  name="creationDate"
                  header={I18n.t('CAMPAIGNS.GRID_VIEW.CREATED')}
                  render={this.renderDate('creationDate')}
                />
                <GridViewColumn
                  name="status"
                  header={I18n.t('CAMPAIGNS.GRID_VIEW.STATUS')}
                  render={this.renderStatus}
                />
              </GridView>
            </Otherwise>
          </Choose>
        </div>
      </div>
    );
  }
}

export default CampaignsList;
