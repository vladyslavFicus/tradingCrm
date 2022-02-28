import React, { Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { cloneDeep, set } from 'lodash';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Modal, Sort, State } from 'types';
import withModals from 'hoc/withModals';
import { OrderStatus } from 'types/trading-engine';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import EditOrderModal from 'routes/TE/modals/EditOrderModal';
import { tradeStatusesColor, types } from '../../attributes/constants';
import { getTypeColor } from '../../attributes/utils';
import AccountProfileGridFilter from './components/AccountProfileOrdersGridFilter';
import { useHistoryQuery, HistoryQueryVariables, HistoryQuery } from './graphql/__generated__/HistoryQuery';
import './AccountProfileHistoryGrid.scss';

type Props = {
  modals: {
    editOrderModal: Modal<{
      orderId: number,
      onSuccess: Function,
    }>
  }
};

type Order = ExtractApolloTypeFromPageable<HistoryQuery['tradingEngine']['history']>;

const AccountProfileHistoryGrid = (props: Props) => {
  const history = useHistory();
  const { state } = useLocation<State<HistoryQueryVariables>>();
  const { id } = useParams<{ id: string }>();

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

  const { content = [], last = true, totalElements } = historyQuery.data?.tradingEngine.history || {};

  const handlePageChanged = () => {
    const { data, variables, fetchMore } = historyQuery;
    const page = data?.tradingEngine.history.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables as HistoryQueryVariables), 'args.page.from', page + 1),
    });
  };

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handleClosedOrderModal = ({ status, id: orderId }: Order) => {
    const isShowClosedOrderModal = status === OrderStatus.CLOSED || status === OrderStatus.CANCELED;

    if (isShowClosedOrderModal) {
      props.modals.editOrderModal.show({
        orderId,
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
          stickyFromTop={152}
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
                    TR - {orderId}
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
                    getTypeColor(type),
                    'AccountProfileHistoryGrid__cell-value',
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
                    className={tradeStatusesColor[status]}
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


export default compose(
  React.memo,
  withModals({
    editOrderModal: EditOrderModal,
  }),
)(AccountProfileHistoryGrid);
