import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import TradingEngineOrdersGridFilter from './components/TradingEngineOrdersGridFilter';
import { tradeStatusesColor, types } from './attributes/constants';
import { getTypeColor } from './attributes/utils';
import './AccountProfileOrdersGrid.scss';

class AccountProfileOrdersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    tradingEngineOrdersQuery: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
  };

  refetchOrders = () => this.props.tradingEngineOrdersQuery.refetch();

  handlePageChanged = () => {
    const {
      tradingEngineOrdersQuery: {
        data,
        loadMore,
      },
    } = this.props;

    const page = data?.tradingEngineOrders?.number || 0;

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

  render() {
    const {
      tradingEngineOrdersQuery: {
        data,
        loading,
      },
    } = this.props;

    const { content = [], last = true, totalElements = 0 } = data?.tradingEngineOrders || {};

    return (
      <div className="AccountProfileOrdersGrid">
        <div className="card">
          <div className="card-heading card-heading--is-sticky">
            <div className="AccountProfileOrdersGrid__statistics-block">
              <span className="font-size-20">
                <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.HEADLINE')}
              </span>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.DEPOSIT')}
                  </strong>: <span>500</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.WITHDRAW')}
                  </strong>: <span>500</span>
                </div>
              </div>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.CREDIT')}
                  </strong>: <span>100</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.BALANCE')}
                  </strong>: <span>550</span>
                </div>
              </div>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.EQUITY')}
                  </strong>: <span>100</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN')}
                  </strong>: <span>550</span>
                </div>
              </div>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.FREE_MARGIN')}
                  </strong>: <span>100</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN_LEVEL')}
                  </strong>: <span>550</span>
                </div>
              </div>
            </div>
          </div>

          <TradingEngineOrdersGridFilter handleRefetch={this.refetchOrders} />

          <div>
            <Table
              stickyFromTop={189}
              items={content}
              loading={loading}
              hasMore={!last}
              onSort={this.handleSort}
              onMore={this.handlePageChanged}
            >
              <Column
                sortBy="trade"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TRADE')}
                render={({ tradeId, tradeType }) => (
                  <Fragment>
                    <Badge
                      text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
                      info={tradeType === 'DEMO'}
                      success={tradeType === 'LIVE'}
                    >
                      <div
                        className="AccountProfileOrdersGrid__cell-value AccountProfileOrdersGrid__cell-value--pointer"
                      >
                        TR-{tradeId}
                      </div>
                    </Badge>
                    <div className="AccountProfileOrdersGrid__cell-value-add">
                      <Uuid
                        uuid={`${tradeId}`}
                        uuidPrefix="TR"
                      />
                    </div>
                  </Fragment>
                )}
              />
              <Column
                sortBy="type"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TYPE')}
                render={({ operationType }) => (
                  <div
                    className={classNames(
                      getTypeColor(types.find(item => item.value === operationType).value),
                      'AccountProfileOrdersGrid__cell-value',
                    )}
                  >
                    {I18n.t(types.find(item => item.value === operationType).label)}
                  </div>
                )}
              />
              <Column
                sortBy="openPrice"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPEN_PRICE')}
                render={({ openPrice, stopLoss, takeProfit }) => (
                  <Fragment>
                    <div className="AccountProfileOrdersGrid__cell-value">{openPrice}</div>
                    <If condition={stopLoss}>
                      <div className="AccountProfileOrdersGrid__cell-value-add">
                        S/L {parseFloat(stopLoss).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                      </div>
                    </If>
                    <If condition={takeProfit}>
                      <div className="AccountProfileOrdersGrid__cell-value-add">
                        T/P {parseFloat(takeProfit).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                      </div>
                    </If>
                  </Fragment>
                )}
              />
              <Column
                sortBy="volume"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.VOLUME')}
                render={({ volume }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{volume}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
                render={({ profit }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{profit}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.T/P')}
                render={({ profit }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{profit}</div>
                )}
              />
              <Column
                sortBy="swap"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SWAP')}
                render={({ swap }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{swap}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.P&L')}
                render={({ profit }) => (
                  <div className="TAccountProfileOrdersGrid__cell-value">{profit}</div>
                )}
              />
              <Column
                sortBy="openTime"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPEN_TIME')}
                render={({ openTime }) => (
                  <Fragment>
                    <div className="AccountProfileOrdersGrid__cell-value">
                      {moment(moment.unix(openTime)).format('DD.MM.YYYY')}
                    </div>
                    <div className="AccountProfileOrdersGrid__cell-value-add">
                      {moment(moment.unix(openTime)).format('HH:mm:ss')}
                    </div>
                  </Fragment>
                )}
              />
              <Column
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.STATUS')}
                render={({ tradeStatus }) => (
                  <div
                    className={tradeStatusesColor[`${tradeStatus}`]}
                  >
                    <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATUSES.${tradeStatus}`)}</strong>
                  </div>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    tradingEngineOrdersQuery: TradingEngineOrdersQuery,
  }),
)(AccountProfileOrdersGrid);
