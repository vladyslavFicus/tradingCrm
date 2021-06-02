import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import moment from 'moment';
import { accountTypesLabels } from 'constants/accountTypes';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Tabs from 'components/Tabs';
import Uuid from 'components/Uuid';
import { tradingEngineTabs } from '../../TradingEngine/constants';
import TradingEngineAccountsFilters from './components/TradingEngineAccountsFilters';
import TradingEngineAccountsQuery from './graphql/TradingEngineAccountsQuery';
import './TradingEngineAccountsGrid.scss';

class TradingEngineAccountsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    accounts: PropTypes.query({
      tradingEngineAccountsData: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      accounts,
      accounts: {
        loadMore,
      },
    } = this.props;

    const page = get(accounts, 'data.tradingEngineAccounts.number') || 0;

    loadMore(page + 1);
  };

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  renderTradingAccountColumn = ({ uuid, name, accountType, platformType, archived }) => (
    <Fragment>
      <Badge
        text={I18n.t(archived ? 'CONSTANTS.ARCHIVED' : accountTypesLabels[accountType].label)}
        info={accountType === 'DEMO' && !archived}
        success={accountType === 'LIVE' && !archived}
        danger={archived}
      >
        <div className="font-weight-700">
          {name}
        </div>
      </Badge>
      <div className="font-size-11">
        <Uuid uuid={uuid} uuidPrefix={platformType} />
      </div>
    </Fragment>
  );

  renderLoginColumn = ({ login, group }) => (
    <Link to="/trading-engine/accounts/test-uuid">
      <div className="font-weight-700">
        {login}
      </div>
      <div className="font-size-11">
        {group}
      </div>
    </Link>
  );

  render() {
    const {
      location: { state },
      accounts,
      accounts: {
        loading,
      },
    } = this.props;

    const { content = [], last = true } = accounts.data?.tradingEngineAccounts || {};

    const totalElements = get(accounts, 'data.tradingEngineAccounts.totalElements') || 0;


    return (
      <div className="card">
        <Tabs items={tradingEngineTabs} />

        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNTS.HEADLINE')}
          </span>
        </div>

        <TradingEngineAccountsFilters
          loading={loading}
          handleRefetch={accounts.refetch}
        />

        <div className="TradingEngineAccountsGrid">
          <Table
            stickyFromTop={125}
            items={content}
            sorts={state?.sorts}
            loading={loading}
            hasMore={!last}
            onMore={this.handlePageChanged}
            onSort={this.handleSort}
          >
            <Column
              sortBy="login"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LOGIN')}
              render={this.renderLoginColumn}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.ACCOUNT_ID')}
              render={this.renderTradingAccountColumn}
            />
            <Column
              sortBy="profile"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.PROFILE')}
              render={({ profileUuid, profileFullName }) => (
                <GridPlayerInfo profile={{ uuid: profileUuid, fullName: profileFullName }} />
              )}
            />
            <Column
              sortBy="createdAt"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.DATE')}
              render={({ createdAt }) => (
                <If condition={createdAt}>
                  <div className="font-weight-700">
                    {moment.utc(createdAt).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="font-size-11">
                    {moment.utc(createdAt).local().format('HH:mm:ss')}
                  </div>
                </If>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.CREDIT')}
              render={({ credit }) => (
                <div className="font-weight-700">{I18n.toCurrency(credit, { unit: '' })}</div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.LEVERAGE')}
              render={({ leverage }) => (
                <If condition={leverage}>
                  <div className="font-weight-700">{leverage}</div>
                </If>
              )}
            />
            <Column
              sortBy="balance"
              header={I18n.t('TRADING_ENGINE.ACCOUNTS.GRID.BALANCE')}
              render={({ balance }) => (
                <div className="font-weight-700">{I18n.toCurrency(balance, { unit: '' })}</div>
              )}
            />
          </Table>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    accounts: TradingEngineAccountsQuery,
  }),
)(TradingEngineAccountsGrid);
