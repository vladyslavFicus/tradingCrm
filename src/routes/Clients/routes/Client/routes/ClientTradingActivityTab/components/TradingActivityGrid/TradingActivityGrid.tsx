import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { getBackofficeBrand } from 'config';
import { Sort, Sorts } from 'types';
import { TradingActivity } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import UpdateTradingActivityModal, { UpdateTradingActivityModalProps } from 'modals/UpdateTradingActivityModal';
import { AdjustableTable, Column } from 'components/Table';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { types, statuses } from '../../attributes/constants';
import './TradingActivityGrid.scss';

type Props = {
  content: Array<TradingActivity>,
  loading: boolean,
  last: boolean,
  sorts: Sorts,
  onSort: (sorts: Array<Sort>) => void,
  onRefetch: () => void,
  onLoadMore: () => void,
};

const TradingActivityGrid = (props: Props) => {
  const { content, loading, last, sorts, onSort, onRefetch, onLoadMore } = props;

  const columnsOrder = getBackofficeBrand()?.tables?.clientTradingActivity?.columnsOrder || [];

  // ===== Modals ===== //
  const updateTradingActivityModal = useModal<UpdateTradingActivityModalProps>(UpdateTradingActivityModal);

  // ===== Handlers ===== //
  const handleShowUpdateTradingActivityModal = (tradingActivity: TradingActivity) => {
    const { tradeId, originalAgent, platformType } = tradingActivity;

    updateTradingActivityModal.show({
      tradeId,
      originalAgent: originalAgent || undefined,
      platformType: platformType || undefined,
      onSuccess: onRefetch,
    });
  };

  // ===== Renders ===== //
  const renderTrade = (tradingActivity: TradingActivity) => {
    const { tradeId, tradeType } = tradingActivity;

    return (
      <>
        <Badge
          text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
          info={tradeType === 'DEMO'}
          success={tradeType === 'LIVE'}
        >
          <div
            className="TradingActivityGrid__cell-value TradingActivityGrid__cell-value--pointer"
            onClick={() => (
              handleShowUpdateTradingActivityModal(tradingActivity)
            )}
          >
            TR-{tradeId}
          </div>
        </Badge>

        <div className="TradingActivityGrid__cell-value-add">
          <Uuid uuid={`${tradeId}`} uuidPrefix="TR" />
        </div>
      </>
    );
  };

  const renderType = ({ operationType }: TradingActivity) => (
    <div
      className={classNames(
        'TradingActivityGrid__type',
        'TradingActivityGrid__cell-value',
        {
          'TradingActivityGrid__type--buy': `${operationType}`.includes('BUY'),
          'TradingActivityGrid__type--sell': !`${operationType}`.includes('BUY'),
        },
      )}
    >
      {I18n.t(types.find(item => item.value === operationType)?.label || '')}
    </div>
  );

  const renderAccount = ({ login, symbol, platformType }: TradingActivity) => (
    <>
      <PlatformTypeBadge platformType={platformType || ''}>
        <div className="TradingActivityGrid__cell-value">{login}</div>
      </PlatformTypeBadge>

      <div className="TradingActivityGrid__cell-value-add">{symbol}</div>
    </>
  );

  const renderOriginalAgent = ({ originalAgent }: TradingActivity) => {
    if (!originalAgent) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TradingActivityGrid__cell-value">
          {originalAgent.fullName}
        </div>

        <div className="TradingActivityGrid__cell-value-add">
          <Uuid uuid={originalAgent.uuid} />
        </div>
      </>
    );
  };

  const renderOpenPrice = ({ openPrice, stopLoss, takeProfit }: TradingActivity) => (
    <>
      <div className="TradingActivityGrid__cell-value">{openPrice}</div>

      <If condition={!!stopLoss}>
        <div className="TradingActivityGrid__cell-value-add">
          S/L {parseFloat(`${stopLoss}`).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
        </div>
      </If>

      <If condition={!!takeProfit}>
        <div className="TradingActivityGrid__cell-value-add">
          T/P {parseFloat(`${takeProfit}`).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
        </div>
      </If>
    </>
  );

  const rendeTime = (time?: number | null) => {
    if (!time) {
      return <span>&mdash;</span>;
    }

    return (
      <>
        <div className="TradingActivityGrid__cell-value">
          {moment(moment.unix(time)).format('DD.MM.YYYY')}
        </div>

        <div className="TradingActivityGrid__cell-value-add">
          {moment(moment.unix(time)).format('HH:mm:ss')}
        </div>
      </>
    );
  };

  const renderStatus = ({ tradeStatus }: TradingActivity) => (
    <div
      className={classNames(
        'TradingActivityGrid__status',
        'TradingActivityGrid__cell-value TradingActivityGrid__cell-value--upper',
        {
          'TradingActivityGrid__status--open': tradeStatus === statuses.OPEN,
          'TradingActivityGrid__status--closed': tradeStatus === statuses.CLOSED,
          'TradingActivityGrid__status--pending': tradeStatus === statuses.PENDING,
        },
      )}
    >
      {I18n.t(`CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.${tradeStatus}`)}
    </div>
  );

  return (
    <div className="TradingActivityGrid">
      <AdjustableTable
        columnsOrder={columnsOrder}
        stickyFromTop={189}
        items={content}
        loading={loading}
        sorts={sorts}
        onSort={onSort}
        hasMore={!last}
        onMore={onLoadMore}
      >
        <Column
          name="trade"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADE')}
          render={renderTrade}
        />

        <Column
          name="type"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TYPE')}
          render={renderType}
        />

        <Column
          name="account"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADING_ACC')}
          render={renderAccount}
        />

        <Column
          name="originalAgent"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.ORIGINAL_AGENT')}
          render={renderOriginalAgent}
        />

        <Column
          name="openPrice"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_PRICE')}
          render={renderOpenPrice}
        />

        <Column
          name="closePrice"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_PRICE')}
          render={({ closePrice, closeTime }) => (
            <div className="TradingActivityGrid__cell-value">{closeTime ? closePrice : '-'}</div>
          )}
        />

        <Column
          name="volume"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.VOLUME')}
          render={({ volume }) => (
            <div className="TradingActivityGrid__cell-value">{volume}</div>
          )}
        />

        <Column
          name="commission"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.COMISSION')}
          render={({ commission }) => (
            <div className="TradingActivityGrid__cell-value">{Number(commission).toFixed(2)}</div>
          )}
        />

        <Column
          name="swap"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.SWAP')}
          render={({ swap }) => (
            <div className="TradingActivityGrid__cell-value">{swap}</div>
          )}
        />

        <Column
          name="pnl"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.P&L')}
          render={({ profit }) => (
            <div className="TradingActivityGrid__cell-value">{profit}</div>
          )}
        />

        <Column
          name="openTime"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_TIME')}
          render={({ openTime }: TradingActivity) => rendeTime(openTime)}
        />

        <Column
          name="closeTime"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_TIME')}
          render={({ closeTime }: TradingActivity) => rendeTime(closeTime)}
        />

        <Column
          name="status"
          header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.STATUS')}
          render={renderStatus}
        />
      </AdjustableTable>
    </div>
  );
};

export default React.memo(TradingActivityGrid);
