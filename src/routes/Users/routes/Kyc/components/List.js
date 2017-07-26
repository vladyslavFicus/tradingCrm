import React, { Component } from 'react';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import _ from 'lodash';
import UserGridFilter from './KycGridFilter';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Panel, { Title, Content } from '../../../../../components/Panel';
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

class List extends Component {
  static propTypes = {
    fetchEntities: PropTypes.func.isRequired,
    list: PropTypes.pageableState(PropTypes.kycRequestEntity).isRequired,
    filterValues: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
  };
  static defaultProps = {
    filterValues: {},
  };
  static contextTypes = {
    addPanel: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  handlePageChanged = (page) => {
    if (!this.props.list.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };
  handleRefresh = () => this.props.fetchEntities({
    ...this.state.filters,
    page: this.state.page,
  });

  handleFilterSubmit = (data) => {
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
        const parts = status.split('.');
        const statusKey = parts[0];
        const statusValue = parts[1];
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

  renderUserInfo = (data) => {
    const panelData = {
      fullName: `${data.firstName || '-'} ${data.lastName || '-'}`,
      login: data.username,
      uuid: data.playerUUID,
    };

    return (
      <GridPlayerInfo
        profile={{
          ...data,
          uuid: data.playerUUID,
          age: data.birthDate ? moment().diff(data.birthDate, 'years') : null,
        }}
        onClick={() => this.context.addPanel(panelData)}
      />
    );
  };

  renderInitiated = (data) => {
    const type = data.kycRequest && data.kycRequest.authorUUID ?
      kysRequestTypesLabels[kysRequestTypes.MANUAL] :
      kysRequestTypesLabels[kysRequestTypes.AUTO];

    return (
      <div>
        <div className="font-weight-700">{I18n.t(type)}</div>
        <div className="font-size-11 color-default">
          {
            data.kycRequest && data.kycRequest.createDate &&
            <div>
              {I18n.t('COMMON.DATE_ON', {
                date: moment(data.kycRequest.createDate).format('DD.MM.YYYY'),
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

    let date = moment(address.statusDate).format('DD.MM.YYYY - HH:mm');
    date = status === kycStatuses.PENDING ? I18n.t('COMMON.SINCE', { date }) : I18n.t('COMMON.DATE_ON', { date });

    return (
      <div>
        <div className={classNames(kysStatusColorNames[status], 'text-uppercase font-weight-700')}>
          {I18n.t(kysStatusLabels[status]) || status}
        </div>
        <div className="font-size-11 color-default">
          {date}
          {
            status === kycStatuses.VERIFIED &&
            <div>
              {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={address.author} />
            </div>
          }
        </div>
      </div>
    );
  }

  render() {
    const { list: { entities }, filterValues, locale } = this.props;
    const { filters } = this.state;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Title>
            <div className="row">
              <div className="col-md-3">
                <span className="font-size-20">
                  {I18n.t('KYC_REQUESTS.TITLE')}
                </span>
              </div>
            </div>
          </Title>
          <UserGridFilter
            onSubmit={this.handleFilterSubmit}
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
        </Panel>
      </div>
    );
  }
}

export default List;
