import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { get } from 'lodash';
import moment from 'moment';
import { accountTypesLabels } from 'constants/accountTypes';
import PropTypes from 'constants/propTypes';
import Badge from 'components/Badge';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Uuid from 'components/Uuid';
import TradingEngineAccountsFilters from './components/TradingEngineAccountsFilters';
import TradingEngineAccountsQuery from './graphql/TradingEngineAccountsQuery';
import './TradingEngineAccountsGrid.scss';

class TradingEngineAccountsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    tradingEngineAccountsData: PropTypes.query({
      tradingEngineAccountsData: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      tradingEngineAccountsData,
      tradingEngineAccountsData: {
        loadMore,
      },
    } = this.props;

    const page = get(tradingEngineAccountsData, 'data.tradingEngineAccounts.number') || 0;

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
    <Fragment>
      <div className="font-weight-700">
        {login}
      </div>
      <div className="font-size-11">
        {group}
      </div>
    </Fragment>
  );

  renderCreditColumn = ({ credit, currency }) => (
    <div className="font-weight-700">{currency} {I18n.toCurrency(credit, { unit: '' })}</div>
  );

  render() {
    const {
      location: { state },
      tradingEngineAccountsData,
      tradingEngineAccountsData: {
        loading,
      },
    } = this.props;

    const { content = [], last = true } = tradingEngineAccountsData.data?.tradingEngineAccounts || {};

    const totalElements = get(tradingEngineAccountsData, 'data.tradingEngineAccounts.totalElements') || 0;


    return (
      <div className="card">
        <div className="card-heading card-heading--is-sticky">
          <span className="font-size-20">
            <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNTS.HEADLINE')}
          </span>
        </div>

        <TradingEngineAccountsFilters
          loading={loading}
          handleRefetch={tradingEngineAccountsData.refetch}
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
              header={I18n.t('TRADING_ENGINE.GRID.LOGIN')}
              render={this.renderLoginColumn}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.GRID.ACCOUNT_ID')}
              render={this.renderTradingAccountColumn}
            />
            <Column
              sortBy="profile"
              header={I18n.t('TRADING_ENGINE.GRID.PROFILE')}
              render={({ profile }) => (
                <If condition={profile}>
                  <GridPlayerInfo profile={profile} />
                </If>
              )}
            />
            <Column
              sortBy="createdAt"
              header={I18n.t('TRADING_ENGINE.GRID.DATE')}
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
              header={I18n.t('TRADING_ENGINE.GRID.CREDIT')}
              render={this.renderCreditColumn}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.GRID.LEVERAGE')}
              render={({ leverage }) => (
                <If condition={leverage}>
                  <div className="font-weight-700">{leverage}</div>
                </If>
              )}
            />
            <Column
              sortBy="balance"
              header={I18n.t('TRADING_ENGINE.GRID.BALANCE')}
              render={({ balance, currency }) => (
                <div className="font-weight-700">{currency} {I18n.toCurrency(balance, { unit: '' })}</div>
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
    tradingEngineAccountsData: TradingEngineAccountsQuery,
  }),
)(TradingEngineAccountsGrid);
