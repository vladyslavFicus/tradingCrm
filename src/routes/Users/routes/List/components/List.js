import React, { Component, PropTypes } from 'react';
import Panel, { Content } from 'components/Panel';
import GridView, { GridColumn } from 'components/GridView';
import classNames from 'classnames';
import './List.scss';
import moment from 'moment';
import { shortify } from 'utils/uuid';
import Amount from 'components/Amount';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels
} from 'constants/user';
import UserGridFilter from './UserGridFilter';
import { Link } from 'react-router';

class List extends Component {
  state = {
    filters: {},
    page: 0,
  };

  handlePageChanged = (page) => {
    if (!this.props.isLoading) {
      this.setState({ page: page - 1 }, () => this.handleRefresh());
    }
  };

  handleRefresh = () => {
    return this.props.fetchESEntities({
      ...this.state.filters,
      page: this.state.page,
      playerUUID: this.props.params.id,
    });
  };

  componentWillMount() {
    this.handleRefresh();
  }

  handleFilterSubmit = (filters) => {
    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  render() {
    const { filters } = this.state;
    const { list: { entities }, filterValues } = this.props;

    return <div className="page-content-inner user-list-layout">
      <Panel withBorders>
        <Content>
          <UserGridFilter
            onSubmit={this.handleFilterSubmit}
            initialValues={filters}
            filterValues={filterValues}
          />
          <GridView
            tableClassName="table table-hovered user-list-table"
            headerClassName=""
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
          >
            <GridColumn
              name="id"
              header="Player"
              headerClassName='text-uppercase'
              render={this.renderUserInfo}
            />
            <GridColumn
              name="location"
              header="Location"
              headerClassName='text-uppercase'
              render={this.renderLocation}
            />
            <GridColumn
              name="affiliateId"
              header="Affiliate"
              headerClassName='text-uppercase'
              render={this.renderAffiliate}
            />
            <GridColumn
              name="registrationDate"
              header="Registered"
              headerClassName='text-uppercase'
              render={this.renderRegistered}
            />
            <GridColumn
              name="balance"
              header="Balance"
              headerClassName='text-uppercase'
              render={this.renderBalance}
            />
            <GridColumn
              name="profileStatus"
              header="Status"
              headerClassName='text-uppercase'
              render={this.renderStatus}
            />
          </GridView>
        </Content>
      </Panel>
    </div>;
  }

  getUserAge = (birthDate) => {
    return birthDate ? `(${moment().diff(birthDate, 'years')})` : null;
  };

  renderUserInfo = data => {
    return (
      <div>
        <div className="font-weight-700">
          <Link to={`/users/${data.playerUUID}/profile`} target="_blank">
            {[data.firstName, data.lastName, this.getUserAge(data.birthDate)].join(' ')}
          </Link>
        </div>
        <div className="font-size-12 color-default">
          <div>{[data.username, shortify(data.playerUUID, 'PL')].join(' - ')}</div>
          <div>{data.languageCode}</div>
        </div>
      </div>
    );
  };

  renderLocation = data => {
    return (
      <div className="font-weight-700">{data.country}</div>
    );
  };

  renderAffiliate = data => {
    return (
      <div>{!!data.affiliateId ? data.affiliateId : 'Empty'}</div>
    );
  };

  renderRegistered = data => {
    return (
      <div>
        <div className="font-weight-700">{ moment(data.registrationDate).format('DD.MM.YYYY') }</div>
        <div className="font-size-12 color-default">
          { moment(data.registrationDate).format('HH.mm.ss') }
        </div>
      </div>
    );
  };

  renderBalance = data => {
    return data.balance ? <Amount { ...data.balance }/> : 'Empty';
  };

  renderStatus = data => {
    return (
      <div>
        <div className={classNames(userStatusColorNames[data.profileStatus], 'text-uppercase font-weight-700')}>
          {userStatusesLabels[data.profileStatus] || data.profileStatus}
        </div>
        <div className="font-size-12 color-default">
          Since {moment(data.profileStatusDate).format('DD.MM.YYYY')}
        </div>
      </div>
    );
  };

}

export default List;
