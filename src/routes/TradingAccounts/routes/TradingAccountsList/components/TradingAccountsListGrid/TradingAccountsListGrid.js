import React, { PureComponent, Fragment } from 'react';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import './TradingAccountsListGrid.scss';

class TradingAccountsListGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    tradingAccountsData: PropTypes.query({
      tradingAccounts: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
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

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      tradingAccountsData,
      tradingAccountsData: {
        loadMore,
        variables,
      },
    } = this.props;

    const page = get(tradingAccountsData, 'data.tradingAccounts.number') || 0;
    const filters = state?.filters;
    const sorts = state?.sorts;
    const size = variables?.args?.page?.size;

    loadMore({
      ...filters,
      page: {
        from: page + 1,
        size,
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

  renderLoginColumn = ({ login, group, platformType }) => (
    <Fragment>
      <div className="font-weight-700">
        <PlatformTypeBadge platformType={platformType}>
          {login}
        </PlatformTypeBadge>
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
      location,
      tradingAccountsData,
      tradingAccountsData: {
        loading,
      },
    } = this.props;

    const { content = [], last = true } = tradingAccountsData.data?.tradingAccounts || {};

    return (
      <div className="TradingAccountsListGrid">
        <Table
          stickyFromTop={125}
          items={content}
          sorts={location?.state?.sorts}
          onSort={this.handleSort}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
        >
          <Column
            sortBy="login"
            header={I18n.t('TRADING_ACCOUNTS.GRID.LOGIN')}
            render={this.renderLoginColumn}
          />
          <Column
            sortBy="name"
            header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_ID')}
            render={this.renderTradingAccountColumn}
          />
          <Column
            header={I18n.t('TRADING_ACCOUNTS.GRID.PROFILE')}
            render={({ profile }) => (
              <If condition={profile}>
                <GridPlayerInfo profile={profile} />
              </If>
            )}
          />
          <Column
            sortBy="affiliate.source"
            header={I18n.t('TRADING_ACCOUNTS.GRID.SOURCE_NAME')}
            render={({ affiliate }) => (
              <Choose>
                <When condition={affiliate && affiliate.source}>
                  <div>{affiliate.source}</div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            sortBy="createdAt"
            header={I18n.t('TRADING_ACCOUNTS.GRID.DATE')}
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
            sortBy="credit"
            header={I18n.t('TRADING_ACCOUNTS.GRID.CREDIT')}
            render={this.renderCreditColumn}
          />
          <Column
            sortBy="leverage"
            header={I18n.t('TRADING_ACCOUNTS.GRID.LEVERAGE')}
            render={({ leverage }) => (
              <If condition={leverage}>
                <div className="font-weight-700">{leverage}</div>
              </If>
            )}
          />
          <Column
            sortBy="balance"
            header={I18n.t('TRADING_ACCOUNTS.GRID.BALANCE')}
            render={({ balance, currency }) => (
              <div className="font-weight-700">{currency} {I18n.toCurrency(balance, { unit: '' })}</div>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withRouter,
)(TradingAccountsListGrid);
