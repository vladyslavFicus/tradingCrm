import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EditOrderModal from 'routes/TradingEngine/modals/EditOrderModal';
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
    orders: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  refetchOrders = () => this.props.orders.refetch();

  handlePageChanged = () => {
    const {
      location: {
        state,
      },
      match: {
        params: {
          id,
        },
      },
      orders: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineOrders?.number || 0;
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    loadMore({
      args: {
        accountUuid: id,
        ...filters,
        page: {
          from: currentPage + 1,
          size,
          sorts,
        },
      },
    });
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
      location: { state },
      orders: {
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
              stickyFromTop={152}
              items={content}
              loading={loading}
              hasMore={!last}
              sorts={state?.sorts}
              onSort={this.handleSort}
              onMore={this.handlePageChanged}
            >
              <Column
                sortBy="id"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.TRADE')}
                render={({ id }) => (
                  <div
                    className="AccountProfileOrdersGrid__uuid"
                    onClick={() => editOrderModal.show({
                      id,
                      onSuccess: () => this.refetchOrders(),
                    })}
                  >
                    <div className="AccountProfileOrdersGrid__cell-value">
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
                render={({ type }) => (
                  <div
                    className={classNames(
                      getTypeColor(types.find(item => item.value === type).value),
                      'AccountProfileOrdersGrid__cell-value',
                    )}
                  >
                    {I18n.t(types.find(item => item.value === type).label)}
                  </div>
                )}
              />
              <Column
                sortBy="openingTime"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.OPENING_TIME')}
                render={({ time }) => (
                  <Fragment>
                    <div className="AccountProfileOrdersGrid__cell-value">
                      {moment.utc(time.creation).local().format('DD.MM.YYYY')}
                    </div>
                    <div className="AccountProfileOrdersGrid__cell-value-add">
                      {moment.utc(time.creation).local().format('HH:mm:ss')}
                    </div>
                  </Fragment>
                )}
              />
              <Column
                sortBy="openingPrice"
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
                sortBy="stopLoss"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.S/L')}
                render={({ stopLoss }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{stopLoss}</div>
                )}
              />
              <Column
                sortBy="takeProfit"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.T/P')}
                render={({ takeProfit }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{takeProfit}</div>
                )}
              />
              <Column
                sortBy="swaps"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.SWAP')}
                render={({ swaps }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{swaps}</div>
                )}
              />
              <Column
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.P&L')}
                render={({ pnl }) => (
                  <div className="AccountProfileOrdersGrid__cell-value">{pnl.net}</div>
                )}
              />
              <Column
                sortBy="closingTime"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.CLOSING_TIME')}
                render={({ time }) => (
                  <Choose>
                    <When condition={time.closing}>
                      <div className="AccountProfileOrdersGrid__cell-value">
                        {moment.utc(time.closing).local().format('DD.MM.YYYY')}
                      </div>
                      <div className="AccountProfileOrdersGrid__cell-value-add">
                        {moment.utc(time.closing).local().format('HH:mm:ss')}
                      </div>
                    </When>
                    <Otherwise>
                      <span>&mdash;</span>
                    </Otherwise>
                  </Choose>
                )}
              />
              <Column
                sortBy="closingPrice"
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.CLOSING_PRICE')}
                render={({ closePrice }) => (
                  <Choose>
                    <When condition={closePrice}>
                      <div className="AccountProfileOrdersGrid__cell-value">{closePrice}</div>
                    </When>
                    <Otherwise>
                      <span>&mdash;</span>
                    </Otherwise>
                  </Choose>
                )}
              />
              <Column
                header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.GRID.STATUS')}
                render={({ status }) => (
                  <Choose>
                    <When condition={status}>
                      <div
                        className={tradeStatusesColor[`${status}`]}
                      >
                        <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.STATUSES.${status}`)}</strong>
                      </div>
                    </When>
                    <Otherwise>
                      <span>&mdash;</span>
                    </Otherwise>
                  </Choose>
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
)(AccountProfileOrdersGrid);
