import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRequests } from 'apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import EditOrderModal from 'routes/TradingEngine/modals/EditOrderModal';
import TradingEngineOrdersQuery from './graphql/TradingEngineOrdersQuery';
import TradingEngineOrdersGridFilter from './components/TradingEngineOrdersGridFilter';
import { tradeStatusesColor, types } from './attributes/constants';
import { getTypeColor } from './attributes/utils';
import './AccountProfileOrdersGrid.scss';

class AccountProfileOrdersGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      editOrderModal: PropTypes.modalType,
    }).isRequired,
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
      modals: {
        editOrderModal,
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
                  </strong>: <span>1000</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.BALANCE')}
                  </strong>: <span>0</span>
                </div>
              </div>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.EQUITY')}
                  </strong>: <span>1071.26</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN')}
                  </strong>: <span>121</span>
                </div>
              </div>
              <div className="AccountProfileOrdersGrid__statistics">
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.FREE_MARGIN')}
                  </strong>: <span>950.26</span>
                </div>
                <div>
                  <strong>
                    {I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATISTICS.MARGIN_LEVEL')}
                  </strong>: <span>885%</span>
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
                render={({ id, tradeType }) => (
                  <div onClick={() => editOrderModal.show()}>
                    <Badge
                      text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
                      info={tradeType === 'DEMO'}
                      success={tradeType === 'LIVE'}
                    >
                      <div
                        className="AccountProfileOrdersGrid__cell-value AccountProfileOrdersGrid__cell-value--pointer"
                      >
                        TR-{id}
                      </div>
                    </Badge>
                    <div className="AccountProfileOrdersGrid__cell-value-add">
                      <Uuid
                        uuid={`${id}`}
                        uuidPrefix="TR"
                      />
                    </div>
                  </div>
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
                render={({ openPrice }) => (
                  <Fragment>
                    <div className="AccountProfileOrdersGrid__cell-value">{openPrice}</div>
                  </Fragment>
                )}
              />
              <Column
                sortBy="volume"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.VOLUME')}
                render={({ volumeUnits }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{volumeUnits}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
                render={({ takeProfit }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{takeProfit}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.T/P')}
                render={({ takeProfit }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{takeProfit}</div>
                )}
              />
              <Column
                sortBy="swap"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SWAP')}
                render={({ swaps }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{swaps}</div>
                )}
              />
              <Column
                sortBy="profit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.P&L')}
                render={({ pnl }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{pnl}</div>
                )}
              />
              <Column
                sortBy="openTime"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPEN_TIME')}
                render={({ time }) => (
                  <Fragment>
                    <div className="AccountProfileOrdersGrid__cell-value">
                      {moment(moment.unix(time)).format('DD.MM.YYYY')}
                    </div>
                    <div className="AccountProfileOrdersGrid__cell-value-add">
                      {moment(moment.unix(time)).format('HH:mm:ss')}
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
  withModals({
    editOrderModal: EditOrderModal,
  }),
  withRequests({
    tradingEngineOrdersQuery: TradingEngineOrdersQuery,
  }),
)(AccountProfileOrdersGrid);
