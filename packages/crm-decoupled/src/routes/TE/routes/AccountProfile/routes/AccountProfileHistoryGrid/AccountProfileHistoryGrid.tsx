import React, { Fragment, useEffect } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sort, State } from 'types';
import { TradingEngine__OrderStatuses__Enum as OrderStatusesEnum } from '__generated__/types';
import { OrderStatus } from 'types/trading-engine';
import EventEmitter, { ORDER_RELOAD, TRANSACTION_CREATED } from 'utils/EventEmitter';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import { useModal } from 'providers/ModalProvider';
import EditOrderModal, { EditOrderModalProps } from 'routes/TE/modals/EditOrderModal';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { types } from '../../attributes/constants';
import AccountProfileGridFilter from './components/AccountProfileOrdersGridFilter';
import { useHistoryQuery, HistoryQueryVariables, HistoryQuery } from './graphql/__generated__/HistoryQuery';
import './AccountProfileHistoryGrid.scss';

type Order = ExtractApolloTypeFromPageable<HistoryQuery['tradingEngine']['history']>;

const AccountProfileHistoryGrid = () => {
  const navigate = useNavigate();
  const state = useLocation().state as State<HistoryQueryVariables>;
  const id = useParams().id as string;

  const editOrderModal = useModal<EditOrderModalProps>(EditOrderModal);

  const historyQuery = useHistoryQuery({
    variables: {
      args: {
        accountUuid: id,
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  useEffect(() => {
    EventEmitter.on(ORDER_RELOAD, historyQuery.refetch);
    EventEmitter.on(TRANSACTION_CREATED, historyQuery.refetch);

    return () => {
      EventEmitter.off(ORDER_RELOAD, historyQuery.refetch);
      EventEmitter.off(TRANSACTION_CREATED, historyQuery.refetch);
    };
  }, []);

  const { content = [], last = true, totalElements } = historyQuery.data?.tradingEngine.history || {};

  // ===== Handlers ===== //
  const { data } = historyQuery;
  const page = data?.tradingEngine.history.number || 0;
  const handlePageChanged = useHandlePageChanged({
    query: historyQuery,
    page,
    path: 'page.from',
  });

  const handleSort = (sorts: Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleClosedOrderModal = ({ status, id: orderId }: Order) => {
    const isShowClosedOrderModal = status === OrderStatus.CLOSED || status === OrderStatus.CANCELED;

    if (isShowClosedOrderModal) {
      editOrderModal.show({
        id: orderId,
        onSuccess: historyQuery.refetch,
      });
    }
  };

  return (
    <div className="AccountProfileHistoryGrid">
      <div className="AccountProfileHistoryGrid__title">
        <strong>{totalElements} </strong>&nbsp;{I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.HEADLINE')}
      </div>

      <AccountProfileGridFilter handleRefetch={historyQuery.refetch} />

      <div>
        <Table
          stickyFromTop={124}
          items={content}
          loading={historyQuery.loading}
          hasMore={!last}
          sorts={state?.sorts}
          onSort={handleSort}
          onMore={handlePageChanged}
        >
          <Column
            sortBy="id"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.TRADE')}
            render={(order: Order) => {
              const { id: orderId } = order;

              return (
                <div className="AccountProfileHistoryGrid__uuid">
                  <div
                    className="AccountProfileHistoryGrid__cell-value AccountProfileHistoryGrid__cell-value--pointer"
                    onClick={() => handleClosedOrderModal(order)
                    }
                  >
                    TR-{orderId}
                  </div>
                  <Uuid
                    uuid={`${orderId}`}
                    uuidPrefix="TR"
                    title={I18n.t('COMMON.COPY')}
                    className="AccountProfileHistoryGrid__cell-value-add"
                  />
                </div>
              );
            }}
          />
          <Column
            sortBy="type"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.TYPE')}
            render={({ type }) => (
              <div
                className={
                  classNames(
                    'AccountProfileHistoryGrid__cell-value',
                    'AccountProfileHistoryGrid__type', {
                      'AccountProfileHistoryGrid__type--buy': type.includes('BUY'),
                      'AccountProfileHistoryGrid__type--sell': !type.includes('BUY'),
                    },
                  )}
              >
                {I18n.t(types.find(item => item.value === type)?.label || '')}
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
                    <span>&mdash;</span>
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
                    <span>&mdash;</span>
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
                    <span>&mdash;</span>
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
                    <span>&mdash;</span>
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
                    <span>&mdash;</span>
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
                    <span>&mdash;</span>
                  </Otherwise>
                </Choose>
              </div>
            )}
          />
          <Column
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.P&L')}
            render={({ profit, status }) => (
              <div className={
                classNames('AccountProfileHistoryGrid__cell-value', {
                  'AccountProfileHistoryGrid__cell-value--neutral': profit === 0,
                  'AccountProfileHistoryGrid__cell-value--positive': profit > 0,
                  'AccountProfileHistoryGrid__cell-value--negative': profit < 0,
                })}
              >
                <Choose>
                  <When condition={status === OrderStatus.CANCELED}>
                    <span>&mdash;</span>
                  </When>
                  <Otherwise>
                    {profit.toFixed(2)}
                  </Otherwise>
                </Choose>
              </div>
            )}
          />
          <Column
            sortBy="commission"
            header={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.HISTORY.GRID.COMMISSION')}
            render={({ commission }) => (
              <Choose>
                <When condition={commission}>
                  <div className="AccountProfileHistoryGrid__cell-value">{commission}</div>
                </When>
                <Otherwise>
                  <span>&mdash;</span>
                </Otherwise>
              </Choose>
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
                    className={classNames(
                      'AccountProfileHistoryGrid__status',
                      {
                        'AccountProfileHistoryGrid__status--closed': status === OrderStatusesEnum.CLOSED,
                      },
                    )}
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
};


export default React.memo(AccountProfileHistoryGrid);
