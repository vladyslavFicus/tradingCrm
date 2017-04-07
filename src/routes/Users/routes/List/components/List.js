import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import moment from 'moment';
import UserGridFilter from './UserGridFilter';
import GridView, { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import Panel, { Content } from '../../../../../components/Panel';
import Amount from '../../../../../components/Amount';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels,
} from '../../../../../constants/user';

class List extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    fetchESEntities: PropTypes.func.isRequired,
    list: PropTypes.object,
    filterValues: PropTypes.object,
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
    exportEntities: PropTypes.func.isRequired,
  };
  static contextTypes = {
    addPanel: PropTypes.func.isRequired,
  };

  state = {
    filters: {},
    page: 0,
  };

  componentWillMount() {
    this.handleRefresh();
  }

  getUserAge = (birthDate) => {
    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleRefresh = () => this.props.fetchESEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  handleExport = () => this.props.exportEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.params.id,
  });

  handleFilterSubmit = (filters) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  renderUserInfo = (data) => {
    const panelData = {
      fullName: `${data.firstName || '-'} ${data.lastName || '-'}`,
      login: data.username,
      uuid: data.playerUUID,
    };

    return (
      <div>
        <div className="font-weight-700">
          <button className="btn-transparent" onClick={() => this.context.addPanel(panelData)}>
            {[data.firstName, data.lastName, this.getUserAge(data.birthDate)].join(' ')}
          </button>
        </div>
        <div className="font-size-11 color-default line-height-1">
          <div>{[data.username, shortify(data.playerUUID, 'PL')].join(' - ')}</div>
          <div>{data.languageCode}</div>
        </div>
      </div>
    );
  };

  renderLocation = (data) => {
    return (
      <div className="font-weight-700">{data.country}</div>
    );
  };

  renderAffiliate = (data) => {
    return (
      <div>{data.affiliateId ? data.affiliateId : 'Empty'}</div>
    );
  };

  renderRegistered = (data) => {
    return (
      <div>
        <div className="font-weight-700">{ moment(data.registrationDate).format('DD.MM.YYYY') }</div>
        <div className="font-size-11 color-default">
          { moment(data.registrationDate).format('HH:mm:ss') }
        </div>
      </div>
    );
  };

  renderBalance = (data) => {
    return data.balance ?
      <div>
        <div className="font-weight-700">
          <Amount {...data.balance} />
        </div>
        {
          data.lastDeposit && data.lastDeposit.transactionDate &&
          <div className="font-size-11 color-default">
            Last deposit { moment(data.lastDeposit.transactionDate).format('DD.MM.YYYY') }
          </div>
        }
      </div>
      : 'Empty';
  };

  renderStatus = (data) => {
    return (
      <div>
        <div className={classNames(userStatusColorNames[data.profileStatus], 'text-uppercase font-weight-700')}>
          {userStatusesLabels[data.profileStatus] || data.profileStatus}
        </div>
        <div className="font-size-11 color-default">
          Since {moment(data.profileStatusDate).format('DD.MM.YYYY')}
        </div>
      </div>
    );
  };

  render() {
    const { filters } = this.state;
    const { list: { entities, exporting }, filterValues } = this.props;

    return (
      <div className="page-content-inner">
        <Panel withBorders>
          <Content>
            <UserGridFilter
              onSubmit={this.handleFilterSubmit}
              initialValues={filters}
              filterValues={filterValues}
              onExportClick={this.handleExport}
              isExportable={!exporting}
            />
            <GridView
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
                header="Player"
                render={this.renderUserInfo}
              />
              <GridColumn
                name="location"
                header="Location"
                render={this.renderLocation}
              />
              <GridColumn
                name="affiliateId"
                header="Affiliate"
                render={this.renderAffiliate}
              />
              <GridColumn
                name="registrationDate"
                header="Registered"
                render={this.renderRegistered}
              />
              <GridColumn
                name="balance"
                header="Balance"
                render={this.renderBalance}
              />
              <GridColumn
                name="profileStatus"
                header="Status"
                render={this.renderStatus}
              />
            </GridView>
          </Content>
        </Panel>
      </div>
    );
  }
}

export default List;
