import React, { PureComponent, Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { getBackofficeBrand } from 'config';
import UpdateTradingActivityModal from 'modals/UpdateTradingActivityModal';
import PropTypes from 'constants/propTypes';
import { AdjustableTable, Column } from 'components/Table';
import Badge from 'components/Badge';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import Uuid from 'components/Uuid';
import { types, statuses } from '../../attributes/constants';
import './TradingActivityGrid.scss';

class TradingActivityGrid extends PureComponent {
  static propTypes = {
    tradingActivityQuery: PropTypes.query({
      tradingActivity: PropTypes.pageable(PropTypes.tradingActivity),
    }).isRequired,
    modals: PropTypes.shape({
      updateTradingActivityModal: PropTypes.modalType,
    }).isRequired,
  };

  handlePageChanged = () => {
    const {
      tradingActivityQuery: {
        data,
        fetchMore,
      },
    } = this.props;

    const currentPage = data?.tradingActivity?.number || 0;

    fetchMore({
      variables: {
        page: currentPage + 1,
      },
    });
  };

  showUpdateTradingActivityModal = (tradeId, originalAgent, platformType) => {
    const { tradingActivityQuery, modals: { updateTradingActivityModal } } = this.props;

    updateTradingActivityModal.show({
      tradeId,
      originalAgent,
      platformType,
      onSuccess: tradingActivityQuery.refetch,
    });
  };

  render() {
    const {
      tradingActivityQuery: {
        data,
        loading,
      },
    } = this.props;

    const { content = [], last = true } = data?.tradingActivity || {};
    const columnsOrder = getBackofficeBrand()?.tables?.clientTradingActivity?.columnsOrder;

    return (
      <div className="TradingActivityGrid">
        <AdjustableTable
          columnsOrder={columnsOrder}
          stickyFromTop={189}
          items={content}
          loading={loading}
          hasMore={!last}
          onMore={this.handlePageChanged}
        >
          <Column
            name="trade"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADE')}
            render={({ tradeId, tradeType, originalAgent, platformType }) => (
              <Fragment>
                <Badge
                  text={I18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
                  info={tradeType === 'DEMO'}
                  success={tradeType === 'LIVE'}
                >
                  <div
                    className="TradingActivityGrid__cell-value TradingActivityGrid__cell-value--pointer"
                    onClick={() => (
                      this.showUpdateTradingActivityModal(tradeId, originalAgent, platformType)
                    )}
                  >
                    TR-{tradeId}
                  </div>
                </Badge>
                <div className="TradingActivityGrid__cell-value-add">
                  <Uuid
                    uuid={`${tradeId}`}
                    uuidPrefix="TR"
                  />
                </div>
              </Fragment>
            )}
          />
          <Column
            name="type"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TYPE')}
            render={({ operationType }) => (
              <div
                className={classNames(
                  'TradingActivityGrid__type',
                  'TradingActivityGrid__cell-value',
                  {
                    'TradingActivityGrid__type--buy': operationType.includes('BUY'),
                    'TradingActivityGrid__type--sell': !operationType.includes('BUY'),
                  },
                )}
              >
                {I18n.t(types.find(item => item.value === operationType).label)}
              </div>
            )}
          />
          <Column
            name="account"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADING_ACC')}
            render={({ login, symbol, platformType }) => (
              <Fragment>
                <PlatformTypeBadge platformType={platformType}>
                  <div className="TradingActivityGrid__cell-value">{login}</div>
                </PlatformTypeBadge>
                <div className="TradingActivityGrid__cell-value-add">{symbol}</div>
              </Fragment>
            )}
          />
          <Column
            name="originalAgent"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.ORIGINAL_AGENT')}
            render={({ originalAgent }) => (
              <Choose>
                <When condition={originalAgent}>
                  <div className="TradingActivityGrid__cell-value">
                    {originalAgent.fullName}
                  </div>
                  <div className="TradingActivityGrid__cell-value-add">
                    <Uuid uuid={originalAgent.uuid} />
                  </div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            name="openPrice"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_PRICE')}
            render={({ openPrice, stopLoss, takeProfit }) => (
              <Fragment>
                <div className="TradingActivityGrid__cell-value">{openPrice}</div>
                <If condition={stopLoss}>
                  <div className="TradingActivityGrid__cell-value-add">
                    S/L {parseFloat(stopLoss).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                  </div>
                </If>
                <If condition={takeProfit}>
                  <div className="TradingActivityGrid__cell-value-add">
                    T/P {parseFloat(takeProfit).toLocaleString('en-EN', { minimumFractionDigits: 5 })}
                  </div>
                </If>
              </Fragment>
            )}
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
            render={({ openTime }) => (
              <Fragment>
                <div className="TradingActivityGrid__cell-value">
                  {moment(moment.unix(openTime)).format('DD.MM.YYYY')}
                </div>
                <div className="TradingActivityGrid__cell-value-add">
                  {moment(moment.unix(openTime)).format('HH:mm:ss')}
                </div>
              </Fragment>
            )}
          />
          <Column
            name="closeTime"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_TIME')}
            render={({ closeTime }) => (
              <Fragment>
                <div className="TradingActivityGrid__cell-value">
                  <Choose>
                    <When condition={closeTime}>
                      {moment(moment.unix(closeTime)).format('DD.MM.YYYY')}
                    </When>
                    <Otherwise>
                      <span>&mdash;</span>
                    </Otherwise>
                  </Choose>
                </div>
                <If condition={closeTime}>
                  <div className="TradingActivityGrid__cell-value-add">
                    {moment(moment.unix(closeTime)).format('HH:mm:ss')}
                  </div>
                </If>
              </Fragment>
            )}
          />
          <Column
            name="status"
            header={I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.STATUS')}
            render={({ tradeStatus }) => (
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
            )}
          />
        </AdjustableTable>
      </div>
    );
  }
}

export default withModals({
  updateTradingActivityModal: UpdateTradingActivityModal,
})(TradingActivityGrid);
