import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Uuid from 'components/Uuid';
import { accountStatuses } from '../../constants';

class TradingAccountsListGrid extends PureComponent {
  static propTypes = {
    tradingAccounts: PropTypes.query({
      tradingAccountsList: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.tradingAccountsList),
        error: PropTypes.any,
      }),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      tradingAccounts: {
        loadMore,
        data,
      },
    } = this.props;

    const page = get(data, 'tradingAccountsList.data.number') || 0;

    loadMore(page + 1);
  };

  render() {
    const {
      tradingAccounts: {
        data,
        loading,
      },
    } = this.props;

    const { content, last } = get(data, 'tradingAccountsList.data') || { content: [] };
    const error = get(data, 'tradingAccountsList.error');

    return (
      <div className="card-body">
        <Grid
          data={content}
          handlePageChanged={this.handlePageChanged}
          isLoading={loading}
          isLastPage={last}
          withNoResults={error}
          withLazyLoad
        >
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_ID')}
            render={({ uuid }) => <Uuid uuid={uuid} />}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.PLATFORM_TYPE')}
            render={({ platformType }) => (
              <If condition={platformType}>
                <div>{platformType}</div>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.PROFILE')}
            render={({ profile }) => (
              <If condition={profile}>
                <GridPlayerInfo profile={profile} />
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.AFFILIATE_TYPE')}
            render={({ affiliate }) => (
              <If condition={affiliate && affiliate.affiliateType}>
                <div>{affiliate.affiliateType}</div>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.SOURCE_NAME')}
            render={({ affiliate }) => (
              <If condition={affiliate && affiliate.source}>
                <div>{affiliate.source}</div>
              </If>
            )}
          />
          <GridColumn
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
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.LEVERAGE')}
            render={({ leverage }) => (
              <If condition={leverage}>
                <div>{leverage}</div>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.BALANCE')}
            render={({ balance, currency }) => (
              <If condition={balance && currency}>
                <div>{currency} {balance}</div>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.STATUS')}
            render={({ archived }) => (
              <If condition={typeof archived === 'boolean'}>
                <div>{I18n.t(accountStatuses[+archived])}</div>
              </If>
            )}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_TYPE')}
            render={({ accountType }) => (
              <If condition={accountType}>
                <div>{accountType}</div>
              </If>
            )}
          />
        </Grid>
      </div>
    );
  }
}

export default TradingAccountsListGrid;
