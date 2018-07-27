import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import UserGridFilter from './UserGridFilter';
import PropTypes from '../../../../../constants/propTypes';
import GridView, { GridViewColumn } from '../../../../../components/GridView';
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
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
    auth: PropTypes.shape({
      brandId: PropTypes.string,
      uuid: PropTypes.string,
    }).isRequired,
  };
  static contextTypes = {
    miniProfile: PropTypes.shape({
      onShowMiniProfile: PropTypes.func.isRequired,
    }),
  };

  state = {
    filters: {},
    page: 0,
    selectedRows: [],
    allRowsSelected: false,
    touchedRowsIds: [],
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
    playerUUID: this.props.match.params.id,
  });

  handleExport = () => this.props.exportEntities({
    ...this.state.filters,
    page: this.state.page,
    playerUUID: this.props.match.params.id,
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

    this.setState({
      filters,
      page: 0,
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    }, () => this.handleRefresh());
  };

  handleFilterReset = () => {
    this.props.reset();
    this.setState({
      filters: {},
      page: 0,
      allRowsSelected: false,
      selectedRows: [],
      touchedRowsIds: [],
    });
  };

  handlePlayerClick = (data) => {
    this.props.onPlayerClick({ ...data, auth: this.props.auth });
  };

  handleSelectedRow = (condition, index, touchedRowsIds) => {
    const { list: { entities } } = this.props;
    const selectedRows = [...this.state.selectedRows];

    if (condition) {
      selectedRows.push(entities.content[index].playerUUID);
    } else {
      selectedRows.splice(index, 1);
    }

    this.setState({
      selectedRows,
      touchedRowsIds,
    });
  };

  handleAllRowsSelect = () => {
    const { list: { entities } } = this.props;
    const { allRowsSelected } = this.state;

    this.setState({
      allRowsSelected: !allRowsSelected,
      touchedRowsIds: [],
      selectedRows: allRowsSelected
        ? []
        : [...Array.from(Array(entities.totalElements).keys())],
    });
  };

  renderUserInfo = data => (
    <GridPlayerInfo
      fetchPlayerProfile={this.props.fetchPlayerMiniProfile}
      profile={data}
      auth={this.props.auth}
    />
  );

  renderLocation = data => (
    <div className="font-weight-700">{data.country}</div>
  );

  renderAffiliate = data => data.affiliateId || 'Empty';

  renderRegistered = data => (
    <Fragment>
      <div className="font-weight-700">{moment.utc(data.registrationDate).local().format('DD.MM.YYYY')}</div>
      <div className="font-size-11">
        {moment.utc(data.registrationDate).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  );

  renderBalance = data => (
    <Choose>
      <When condition={data.balance}>
        <div className="font-weight-700">
          <Amount {...data.balance} />
        </div>
        <If condition={data.lastDeposit && data.lastDeposit.transactionDate}>
          <div className="font-size-11">
            Last deposit {moment.utc(data.lastDeposit.transactionDate).local().format('DD.MM.YYYY')}
          </div>
        </If>
      </When>
      <Otherwise>
        Empty
      </Otherwise>
    </Choose>
  );

  renderStatus = data => (
    <Fragment>
      <div className={classNames(userStatusColorNames[data.profileStatus], 'text-uppercase font-weight-700')}>
        {userStatusesLabels[data.profileStatus] || data.profileStatus}
      </div>
      <If condition={data.profileStatusDate}>
        <div className="font-size-11">
          Since {moment.utc(data.profileStatusDate).local().format('DD.MM.YYYY')}
        </div>
      </If>
    </Fragment>
  );

  render() {
    const {
      list: { entities, exporting, noResults },
      locale,
      tags,
      currencies,
      countries,
    } = this.props;

    const {
      filters,
      allRowsSelected,
      selectedRows,
      touchedRowsIds,
    } = this.state;

    const allowActions = Object
      .keys(filters)
      .filter(i => (filters[i] && Array.isArray(filters[i]) && filters[i].length > 0) || filters[i]).length > 0;

    return (
      <div className="card">
        <div className="card-heading">
          <Choose>
            <When condition={!!entities.totalElements}>
              <span className="font-size-20 height-55 users-list-header">
                <div>
                  <strong>{entities.totalElements} </strong>
                  {I18n.t('COMMON.CLIENTS_FOUND')}
                </div>
                <div className="font-size-14">
                  <strong>{selectedRows.length} </strong>
                  {I18n.t('COMMON.CLIENTS_SELECTED')}
                </div>
              </span>
            </When>
            <Otherwise>
              <span className="font-size-20" id="users-list-header">
                {I18n.t('COMMON.CLIENTS')}
              </span>
            </Otherwise>
          </Choose>

          <If condition={entities.totalPages !== 0 && selectedRows.length !== 0}>
            <div className="grid-bulk-menu ml-auto">
              <span>Bulk actions</span>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.handleSales}
              >
                {I18n.t('COMMON.SALES')}
              </button>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.handleRetention}
              >
                {I18n.t('COMMON.RETENTION')}
              </button>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.handleCompliance}
              >
                {I18n.t('COMMON.COMPLIANCE')}
              </button>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.handleMove}
              >
                {I18n.t('COMMON.MOVE')}
              </button>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.changeStatus}
              >
                {I18n.t('COMMON.CHANGE_STATUS')}
              </button>
              <button
                disabled={exporting || !allowActions}
                className="btn btn-default-outline"
                // onClick={this.handleExportSelected}
              >
                {I18n.t('COMMON.EXPORT_SELECTED')}
              </button>
            </div>
          </If>
        </div>

        <UserGridFilter
          onSubmit={this.handleFiltersChanged}
          onReset={this.handleFilterReset}
          disabled={!allowActions}
          tags={tags}
          currencies={currencies}
          countries={countries}
        />

        <div className="card-body card-grid-multiselect">
          <GridView
            tableClassName="table-hovered"
            dataSource={entities.content}
            onPageChange={this.handlePageChanged}
            activePage={entities.number + 1}
            totalPages={entities.totalPages}
            lazyLoad
            multiselect
            selectedRows={selectedRows}
            allRowsSelected={allRowsSelected}
            touchedRowsIds={touchedRowsIds}
            onAllRowsSelect={this.handleAllRowsSelect}
            onRowSelect={this.handleSelectedRow}
            locale={locale}
            showNoResults={noResults}
            onRowClick={this.handlePlayerClick}
          >
            <GridViewColumn
              name="id"
              header="Player"
              render={this.renderUserInfo}
            />
            <GridViewColumn
              name="location"
              header="Location"
              render={this.renderLocation}
            />
            <GridViewColumn
              name="affiliateId"
              header="Affiliate"
              render={this.renderAffiliate}
            />
            <GridViewColumn
              name="registrationDate"
              header="Registered"
              render={this.renderRegistered}
            />
            <GridViewColumn
              name="balance"
              header="Balance"
              render={this.renderBalance}
            />
            <GridViewColumn
              name="profileStatus"
              header="Status"
              render={this.renderStatus}
            />
          </GridView>
        </div>
      </div>
    );
  }
}

export default withPlayerClick(List);
