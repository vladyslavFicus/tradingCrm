import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import withModals from 'hoc/withModals';
import PropTypes from 'constants/propTypes';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import ClosedOrderModal from 'routes/TradingEngine/TradingEngineManager/modals/ClosedOrderModal';
import { EditButton } from 'components/UI';
import AccountProfileGridFilter from './components/AccountProfileOrdersGridFilter';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import TradingEngineHistoryQuery from './graphql/TradingEngineHistoryQuery';
import './AccountProfileHistoryGrid.scss';

class AccountProfileHistoryGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    modals: PropTypes.shape({
      closedOrderModal: PropTypes.modalType,
    }).isRequired,
    historyQuery: PropTypes.query({
      tradingEngineOrders: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
  };

  refetchHistory = () => this.props.historyQuery.refetch();

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
      historyQuery: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const currentPage = data?.tradingEngineHistory?.number || 0;
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
      historyQuery: {
        data,
        loading,
      },
      modals: {
        closedOrderModal,
      },
    } = this.props;

    const { content = [], last = true, totalElements } = data?.tradingEngineHistory || {};

    return (
      <div className="AccountProfileHistoryGrid">
        <div className="AccountProfileHistoryGrid__title">
          <strong>{totalElements}</strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.HEADLINE')}
        </div>

        <AccountProfileGridFilter handleRefetch={this.refetchHistory} />

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
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.TRADE')}
              render={(order) => {
                const { id, status } = order;
                const isShowClosedOrderModal = ['CLOSED', 'CANCELLED'].includes(status);

                return (
                  <div className="AccountProfileHistoryGrid__uuid">
                    <div className="AccountProfileHistoryGrid__cell-value">
                      <Uuid
                        uuid={`${id}`}
                        uuidPrefix="TR"
                      />
                      <If condition={isShowClosedOrderModal}>
                        <EditButton
                          className="AccountProfileHistoryGrid__edit-button"
                          onClick={() => closedOrderModal.show({
                            order,
                          })}
                        />
                      </If>
                    </div>
                  </div>
                );
              }}
            />
            <Column
              sortBy="type"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.TYPE')}
              render={({ type }) => (
                <div
                  className={classNames(
                    getTypeColor(types.find(item => item.value === type).value),
                    'AccountProfileHistoryGrid__cell-value',
                  )}
                >
                  {I18n.t(types.find(item => item.value === type).label)}
                </div>
              )}
            />
            <Column
              sortBy="symbol"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.SYMBOL')}
              render={({ symbol }) => (
                <div className="AccountProfileOrdersGrid__cell-value">
                  <Choose>
                    <When condition={symbol}>
                      {symbol}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="openingTime"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.OPENING_TIME')}
              render={({ openingTime }) => (
                <Fragment>
                  <div className="AccountProfileHistoryGrid__cell-value">
                    {moment.utc(openingTime).local().format('DD.MM.YYYY')}
                  </div>
                  <div className="AccountProfileHistoryGrid__cell-value-add">
                    {moment.utc(openingTime).local().format('HH:mm:ss')}
                  </div>
                </Fragment>
              )}
            />
            <Column
              sortBy="openingPrice"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.OPEN_PRICE')}
              render={({ openPrice }) => (
                <div className="AccountProfileHistoryGrid__cell-value">
                  <Choose>
                    <When condition={openPrice}>
                      {openPrice}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="volume"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.VOLUME')}
              render={({ volume }) => (
                <div className="AccountProfileHistoryGrid__cell-value">
                  <Choose>
                    <When condition={volume}>
                      {volume}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="stopLoss"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.S/L')}
              render={({ stopLoss }) => (
                <div className="AccountProfileHistoryGrid__cell-value">
                  <Choose>
                    <When condition={stopLoss}>
                      {stopLoss}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="takeProfit"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.T/P')}
              render={({ takeProfit }) => (
                <div className="AccountProfileHistoryGrid__cell-value">
                  <Choose>
                    <When condition={takeProfit}>
                      {takeProfit}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              sortBy="swaps"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.SWAP')}
              render={({ swaps }) => (
                <div className="AccountProfileHistoryGrid__cell-value">
                  <Choose>
                    <When condition={swaps}>
                      {swaps}
                    </When>
                    <Otherwise>
                      &mdash;
                    </Otherwise>
                  </Choose>
                </div>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.P&L')}
              render={({ profit }) => (
                <div className={classNames('AccountProfileHistoryGrid__cell-value', {
                  'AccountProfileHistoryGrid__cell-value--neutral': profit === 0,
                  'AccountProfileHistoryGrid__cell-value--positive': profit > 0,
                  'AccountProfileHistoryGrid__cell-value--negative': profit < 0,
                })}
                >
                  {profit.toFixed(2)}
                </div>
              )}
            />
            <Column
              sortBy="closingPrice"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.CLOSING_PRICE')}
              render={({ closePrice }) => (
                <Choose>
                  <When condition={closePrice}>
                    <div className="AccountProfileHistoryGrid__cell-value">{closePrice}</div>
                  </When>
                  <Otherwise>
                    <span>&mdash;</span>
                  </Otherwise>
                </Choose>
              )}
            />
            <Column
              sortBy="closingTime"
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.CLOSING_TIME')}
              render={({ closingTime }) => (
                <Choose>
                  <When condition={closingTime}>
                    <div className="AccountProfileHistoryGrid__cell-value">
                      {moment.utc(closingTime).local().format('DD.MM.YYYY')}
                    </div>
                    <div className="AccountProfileHistoryGrid__cell-value-add">
                      {moment.utc(closingTime).local().format('HH:mm:ss')}
                    </div>
                  </When>
                  <Otherwise>
                    <span>&mdash;</span>
                  </Otherwise>
                </Choose>
              )}
            />
            <Column
              header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.STATUS')}
              render={({ status }) => (
                <Choose>
                  <When condition={status}>
                    <div
                      className={tradeStatusesColor[`${status}`]}
                    >
                      <strong>{I18n.t(`TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.STATUSES.${status}`)}</strong>
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
    );
  }
}

export default compose(
  withRouter,
  withModals({
    closedOrderModal: ClosedOrderModal,
  }),
  withRequests({
    historyQuery: TradingEngineHistoryQuery,
  }),
)(AccountProfileHistoryGrid);
