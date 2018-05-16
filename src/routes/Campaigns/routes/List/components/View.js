import React, { Component } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import Uuid from '../../../../../components/Uuid';
import PropTypes from '../../../../../constants/propTypes';
import Card, { Title, Content } from '../../../../../components/Card';
import GridView, { GridColumn } from '../../../../../components/GridView';
import BonusCampaignStatus from '../../../../../components/BonusCampaignStatus';

class View extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    campaigns: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      loadMoreCampaigns: PropTypes.func.isRequired,
      campaigns: PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.newBonusCampaignEntity),
      }),
    }).isRequired,
  };

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
      campaigns: { campaigns },
      locale,
    } = this.props;

    if (!campaigns) {
      return null;
    }

    return (
      <Card>
        <Title>
          <span className="font-size-20 mr-auto" id="campaigns-page-title">
            {I18n.t('CAMPAIGNS.TITLE')}
          </span>
          <Link
            className="btn btn-primary-outline"
            to="/campaigns/create"
          >
            {I18n.t('CAMPAIGNS.BUTTON_CREATE_CAMPAIGN')}
          </Link>
        </Title>

        <Content>
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
            <GridColumn
              name="campaign"
              header={I18n.t('CAMPAIGNS.GRID_VIEW.CAMPAIGN')}
              render={this.renderCampaign}
            />
            <GridColumn
              name="creationDate"
              header={I18n.t('CAMPAIGNS.GRID_VIEW.CREATED')}
              render={this.renderDate('creationDate')}
            />
            <GridColumn
              name="status"
              header={I18n.t('CAMPAIGNS.GRID_VIEW.STATUS')}
              render={this.renderStatus}
            />
          </GridView>
        </Content>
      </Card>
    );
  }
}

export default View;
