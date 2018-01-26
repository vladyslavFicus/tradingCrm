import React, { Component } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import UserGridFilter from './UserGridFilter';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridColumn } from '../../../../../components/GridView';
import Card, { Title, Content } from '../../../../../components/Card';
import Amount from '../../../../../components/Amount';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels,
} from '../../../../../constants/user';
import withPlayerClick from '../../../../../utils/withPlayerClick';

class List extends Component {
  static propTypes = {
    fetchESEntities: PropTypes.func.isRequired,
    fetchPlayerMiniProfile: PropTypes.func.isRequired,
    list: PropTypes.pageableState(PropTypes.userProfile).isRequired,
    reset: PropTypes.func.isRequired,
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    exportEntities: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    onPlayerClick: PropTypes.func.isRequired,
    tags: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
    })).isRequired,
    currencies: PropTypes.arrayOf(PropTypes.string).isRequired,
    countries: PropTypes.object.isRequired,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  state = {
    filters: {},
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

  handleFiltersChanged = (data = {}) => {
    const filters = { ...data };

    if (filters.countries) {
      filters.countries = [filters.countries];
    }
    if (filters.tags) {
      filters.tags = [filters.tags];
    }
    if (filters.statuses) {
      filters.statuses = [filters.statuses];
    }

    this.setState({ filters, page: 0 }, () => this.handleRefresh());
  };

  handleFilterReset = () => {
    this.props.reset();
    this.setState({ filters: {}, page: 0 });
  };

  renderUserInfo = data => (
    <GridPlayerInfo
      fetchPlayerProfile={this.props.fetchPlayerMiniProfile}
      profile={data}
    />
  );

  renderLocation = data => (
    <div className="font-weight-700">{data.country}</div>
  );

  renderAffiliate = data => (
    <div>{data.affiliateId ? data.affiliateId : 'Empty'}</div>
  );

  renderRegistered = data => (
    <div>
      <div className="font-weight-700">{moment.utc(data.registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(data.registrationDate).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  renderBalance = data => (
    data.balance ? (
      <div>
        <div className="font-weight-700">
          <Amount {...data.balance} />
        </div>
        {
          data.lastDeposit && data.lastDeposit.transactionDate &&
          <div className="font-size-11">
            Last deposit {moment.utc(data.lastDeposit.transactionDate).local().format('DD.MM.YYYY')}
          </div>
        }
      </div>
    ) : 'Empty'
  );

  renderStatus = data => (
    <div>
      <div className={classNames(userStatusColorNames[data.profileStatus], 'text-uppercase font-weight-700')}>
        {userStatusesLabels[data.profileStatus] || data.profileStatus}
      </div>
      {
        data.profileStatusDate &&
        <div className="font-size-11">
          Since {moment.utc(data.profileStatusDate).local().format('DD.MM.YYYY')}
        </div>
      }
    </div>
  );

  render() {
    const {
      list: { entities, exporting, noResults },
      locale,
      onPlayerClick,
      tags,
      currencies,
      countries,
    } = this.props;
    const { filters } = this.state;
    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <Card>
        <Title>
          <span className="font-size-20" id="users-list-header">
            {I18n.t('COMMON.PLAYERS')}
          </span>

          <button
            disabled={exporting || !allowActions}
            className="btn btn-default-outline ml-auto"
            onClick={this.handleExport}
          >
            {I18n.t('COMMON.EXPORT')}
          </button>
        </Title>

        <UserGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          tags={tags}
          currencies={currencies}
          countries={countries}
        />

        <Content>
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            locale={locale}
            showNoResults={noResults}
            onRowClick={onPlayerClick}
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
      </Card>
    );
  }
}

export default withPlayerClick(List);
