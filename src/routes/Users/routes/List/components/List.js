import React, { Component, PropTypes } from 'react';
import Panel, { Title, Content } from 'components/Panel';
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

class List extends Component {
  handlePageChanged = (page, filters = {}) => {
    if (!this.props.list.isLoading) {
      this.props.fetchESEntities({ ...filters, page: page - 1 });
    }
  };

  handleFiltersChanged = (filters = {}) => {
    this.props.fetchESEntities({ ...filters, page: 0 });
  };

  componentWillMount() {
    this.handleFiltersChanged();
  }

  render() {
    const { list: { entities } } = this.props;

    return <div className="page-content-inner user-list-layout">
      <Panel withBorders>
        <Title><h3>Players</h3></Title>

        <Content>
          <GridView
            tableClassName="table table-hovered user-list-table"
            headerClassName=""
            dataSource={entities.content}
            onFiltersChanged={this.handleFiltersChanged}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
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
          {[data.firstName, data.lastName, this.getUserAge(data.birthDate)].join(' ')}
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
          { moment(data.registrationDate).format('HH.mm') }
        </div>
      </div>
    );
  };

  renderBalance = data => {
    return data.balance ? <Amount { ...data.balance }/> : <Amount { ...data.balance }/>;
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
