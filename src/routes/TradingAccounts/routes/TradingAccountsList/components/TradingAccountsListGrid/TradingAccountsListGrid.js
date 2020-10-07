import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import { get } from 'lodash';
import moment from 'moment';
import PropTypes from 'constants/propTypes';
import { accountTypesLabels } from 'constants/accountTypes';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import Badge from 'components/Badge';
import './TradingAccountsListGrid.scss';

class TradingAccountsListGrid extends PureComponent {
  static propTypes = {
    tradingAccountsData: PropTypes.query({
      tradingAccounts: PropTypes.pageable(PropTypes.tradingAccountsItem),
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      tradingAccountsData,
      tradingAccountsData: {
        loadMore,
      },
    } = this.props;

    const page = get(tradingAccountsData, 'data.tradingAccounts.number') || 0;

    loadMore(page + 1);
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

  renderCreditColumn = ({ credit }) => (
    <div className="font-weight-700">{Number(credit).toFixed(2)}</div>
  );

  render() {
    const {
      tradingAccountsData,
      tradingAccountsData: {
        loading,
      },
    } = this.props;

    const { content, last } = get(tradingAccountsData, 'data.tradingAccounts') || { content: [] };

    return (
      <div className="TradingAccountsListGrid">
        <Grid
          data={content}
          handlePageChanged={this.handlePageChanged}
          isLoading={loading}
          isLastPage={last}
          headerStickyFromTop={126}
          withNoResults={!loading && content.length === 0}
          withLazyLoad
        >
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.LOGIN')}
            render={this.renderLoginColumn}
          />
          <GridColumn
            header={I18n.t('TRADING_ACCOUNTS.GRID.ACCOUNT_ID')}
            render={this.renderTradingAccountColumn}
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
            header={I18n.t('TRADING_ACCOUNTS.GRID.CREDIT')}
            render={this.renderCreditColumn}
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
        </Grid>
      </div>
    );
  }
}

export default TradingAccountsListGrid;
