import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import _ from 'lodash';
import KycGridFilter from './KycGridFilter';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Card, { Title, Content } from '../../../../../components/Card';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import Uuid from '../../../../../components/Uuid';
import {
  statuses as kycStatuses,
  statusesColor as kysStatusColorNames,
  statusesLabels as kysStatusLabels,
  requestTypes as kysRequestTypes,
  requestTypesLabels as kysRequestTypesLabels,
  statusTypes as kysStatusTypes,
} from '../../../../../constants/kyc';
import { statusTypesKeys } from '../constants';

class List extends Component {
  static propTypes = {
    fetchEntities: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    list: PropTypes.pageableState(PropTypes.kycRequestEntity).isRequired,
    filterValues: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    filterValues: {},
  };

  state = {
    filters: {
      statuses: [
        `${statusTypesKeys[kysStatusTypes.ADDRESS]}.${kycStatuses.DOCUMENTS_SENT}`,
        `${statusTypesKeys[kysStatusTypes.IDENTITY]}.${kycStatuses.DOCUMENTS_SENT}`,
      ],
    },
    page: 0,
  };

  componentWillUnmount() {
    this.handleFilterReset();
  }

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };
  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handleFiltersChanged = (data) => {
    let filters = { ...data };

    if (filters.statuses) {
      const statuses = [...filters.statuses];
      delete filters.statuses;

      const customStatusFilters = {};
      if (statuses.indexOf(kysStatusTypes.FULLY_VERIFIED) > -1) {
        filters.fullyVerified = true;
        _.pull(statuses, kysStatusTypes.FULLY_VERIFIED);
      }

      statuses.map((status) => {
        const [statusKey, statusValue] = status.split('.');
        if (customStatusFilters[statusKey]) {
          customStatusFilters[statusKey].push(statusValue);
        } else {
          customStatusFilters[statusKey] = [statusValue];
        }
      });

      const formatStatusFilters = Object.keys(customStatusFilters).reduce((result, current) => ({
        ...result,
        [current]: customStatusFilters[current].join(','),
      }), {});

      filters = { ...filters, ...formatStatusFilters };
    }

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleFilterReset = () => {
    this.props.reset();
    this.setState({ filters: {}, page: 0 });
  };

  renderUserInfo = data => (
    <GridPlayerInfo
      profile={data}
      fetchPlayerProfile={this.props.fetchPlayerMiniProfile}
    />
  );

  renderInitiated = (data) => {
    const type = data.kycRequest && data.kycRequest.authorUUID
      ? kysRequestTypesLabels[kysRequestTypes.MANUAL]
      : kysRequestTypesLabels[kysRequestTypes.AUTO];

    return (
      <div>
        <div className="font-weight-700">{I18n.t(type)}</div>
        <div className="font-size-11">
          {
            data.kycRequest && data.kycRequest.createDate &&
            <div>
              {I18n.t('COMMON.DATE_ON', {
                date: moment.utc(data.kycRequest.createDate).local().format('DD.MM.YYYY'),
              })}
            </div>
          }
          {
            data.kycRequest && data.kycRequest.authorUUID &&
            <div>
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.kycRequest.authorUUID} />
            </div>
          }
        </div>
      </div>
    );
  };

  renderStatus = type => (data) => {
    const address = data[type];
    if (!address) {
      return null;
    }
    const status = address.status;

    let date = moment.utc(address.statusDate).local().format('DD.MM.YYYY - HH:mm');
    date = status === kycStatuses.PENDING ? I18n.t('COMMON.SINCE', { date }) : I18n.t('COMMON.DATE_ON', { date });

    return (
      <div>
        <div className={classNames(kysStatusColorNames[status], 'text-uppercase font-weight-700')}>
          {I18n.t(kysStatusLabels[status]) || status}
        </div>
        <div className="font-size-11">
          {date}
          {
            status === kycStatuses.VERIFIED &&
            <div>
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={address.authorUUID} />
            </div>
          }
        </div>
      </div>
    );
  };

  render() {
    const { list: { entities, noResults }, filterValues, locale } = this.props;
    const { filters } = this.state;

    return (
      <Card>
        <Title>
          <span className="font-size-20">
            {I18n.t('KYC_REQUESTS.TITLE')}
          </span>
        </Title>
        <KycGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          initialValues={filters}
          filterValues={filterValues}
          locale={locale}
        />
        <Content>
          <GridView
            locale={locale}
            tableClassName="table table-hovered data-grid-layout"
            headerClassName="text-uppercase"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            showNoResults={noResults}
          >
            <GridColumn
              name="id"
              header={I18n.t('COMMON.PLAYER')}
              render={this.renderUserInfo}
            />
            <GridColumn
              name="initiated"
              header={I18n.t('KYC_REQUESTS.GRID_VIEW.INITIATED')}
              render={this.renderInitiated}
            />
            <GridColumn
              name="identityStatus"
              header={I18n.t('KYC_REQUESTS.GRID_VIEW.IDENTITY_STATUS')}
              render={this.renderStatus('kycPersonalStatus')}
            />
            <GridColumn
              name="addressStatus"
              header={I18n.t('KYC_REQUESTS.GRID_VIEW.ADDRESS_STATUS')}
              render={this.renderStatus('kycAddressStatus')}
            />
          </GridView>
        </Content>
      </Card>
    );
  }
}

export default List;
