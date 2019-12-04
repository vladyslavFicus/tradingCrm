/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import i18n from 'i18n-js';
import Badge from 'components/Badge';
import Uuid from 'components/Uuid';
import { getTypeColor } from './utils';

export const filterFormAttributeLabels = {
  trade: {
    label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL',
    placeholder: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER',
  },
  type: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPE_LABEL',
  loginIds: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.LOGIN_IDS',
  symbol: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOL_LABEL',
  volume: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.VOLUME_LABEL',
  status: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUS_LABEL',
  openTimeRange: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.OPEN_TIME_RANGE_LABEL',
  closeTimeRange: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.CLOSE_TIME_RANGE_LABEL',
  agentIds: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.ORIGINAL_AGENT_LABEL',
  accountType: 'CONSTANTS.TRANSACTIONS.FILTER_FORM.ATTRIBUTES_LABELS.ACCOUNT_TYPE',
};

export const types = [{
  value: 'OP_BALANCE',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BALANCE',
}, {
  value: 'OP_BUY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY',
}, {
  value: 'OP_BUY_LIMIT',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY_LIMIT',
}, {
  value: 'OP_BUY_STOP',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY_STOP',
}, {
  value: 'OP_CREDIT',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.CREDIT',
}, {
  value: 'OP_SELL',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL',
}, {
  value: 'OP_SELL_LIMIT',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL_LIMIT',
}, {
  value: 'OP_SELL_STOP',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL_STOP',
}];

export const symbols = [{
  value: 'AUDCAD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDCAD',
}, {
  value: 'AUDCHF',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDCHF',
}, {
  value: 'AUDJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDJPY',
}, {
  value: 'AUDNZD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDNZD',
}, {
  value: 'AUDUSD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDUSD',
}, {
  value: 'CADCHF',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CADCHF',
}, {
  value: 'CADJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CADJPY',
}, {
  value: 'CHFJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CHFJPY',
}, {
  value: 'EURAUD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURAUD',
}, {
  value: 'EURCAD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURCAD',
}, {
  value: 'EURCHF',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURCHF',
}, {
  value: 'EURGBP',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURGBP',
}, {
  value: 'EURJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURJPY',
}, {
  value: 'EURNZD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURNZD',
}, {
  value: 'EURUSD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURUSD',
}, {
  value: 'GBPCHF',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPCHF',
}, {
  value: 'GBPJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPJPY',
}, {
  value: 'GBPUSD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPUSD',
}, {
  value: 'NZDJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.NZDJPY',
}, {
  value: 'NZDUSD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.NZDUSD',
}, {
  value: 'USDCAD',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDCAD',
}, {
  value: 'USDCHF',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDCHF',
}, {
  value: 'USDJPY',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDJPY',
}];

export const statuses = [{
  value: 'CLOSED',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.CLOSED',
}, {
  value: 'OPEN',
  label: 'CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.OPEN',
}];

export const columns = changeOriginalAgent => [{
  name: 'trade',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADE'),
  render: ({ tradeId, tradeType, originalAgent }) => (
    <Badge
      text={i18n.t(`CONSTANTS.ACCOUNT_TYPE.${tradeType}`)}
      info={tradeType === 'DEMO'}
      success={tradeType === 'LIVE'}
    >
      <button
        type="button"
        className="btn-transparent-text font-weight-700"
        onClick={() => changeOriginalAgent(tradeId, originalAgent && originalAgent.uuid)}
      >
        TR-{tradeId}
      </button>
    </Badge>
  ),
}, {
  name: 'type',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TYPE'),
  render: ({ cmd }) => (
    <div
      className={classNames(
        getTypeColor(types.find(item => item.value === cmd).value),
        'font-weight-700',
      )}
    >
      {i18n.t(types.find(item => item.value === cmd).label)}
    </div>
  ),
}, {
  name: 'tradingAcc',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADING_ACC'),
  render: ({ login, symbol }) => (
    <Fragment>
      <div className="font-weight-700">{login}</div>
      <div className="font-size-11">{symbol}</div>
    </Fragment>
  ),
}, {
  name: 'originalAgent',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.ORIGINAL_AGENT'),
  render: ({ originalAgent }) => (
    <Choose>
      <When condition={originalAgent}>
        <div className="font-weight-700">
          {originalAgent.fullName}
        </div>
        <div className="font-size-11">
          <Uuid uuid={originalAgent.uuid} />
        </div>
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'openPrice',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_PRICE'),
  render: ({ openPrice }) => (
    <div className="font-weight-700">{openPrice}</div>
  ),
}, {
  name: 'closePrice',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_PRICE'),
  render: ({ closePrice, closeTime }) => <div className="font-weight-700">{closeTime ? closePrice : '-'}</div>,
}, {
  name: 'volume',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.VOLUME'),
  render: ({ volume }) => <div className="font-weight-700">{volume}</div>,
}, {
  name: 'comission',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.COMISSION'),
  render: ({ commission }) => <div className="font-weight-700">{Number(commission).toFixed(2)}</div>,
}, {
  name: 'swap',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.SWAP'),
  render: ({ storage }) => <div className="font-weight-700">{storage}</div>,
}, {
  name: 'p&l',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.P&L'),
  render: ({ profit }) => <div className="font-weight-700">{profit}</div>,
}, {
  name: 'openTime',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.OPEN_TIME'),
  render: ({ openTime }) => (
    <Fragment>
      <div className="font-weight-700">{moment(moment.unix(openTime)).format('DD.MM.YYYY')}</div>
      <div className="font-size-11">{moment(moment.unix(openTime)).format('HH:mm:ss')}</div>
    </Fragment>
  ),
}, {
  name: 'closeTime',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.CLOSE_TIME'),
  render: ({ closeTime }) => (
    <Fragment>
      <div className="font-weight-700">
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
        <div className="font-size-11">{moment(moment.unix(closeTime)).format('HH:mm:ss')}</div>
      </If>
    </Fragment>
  ),
}, {
  name: 'status',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.STATUS'),
  render: ({ closeTime }) => (
    <div
      className={classNames(
        { 'color-danger': closeTime },
        { 'color-success': !closeTime },
        'font-weight-700 text-uppercase',
      )}
    >
      <Choose>
        <When condition={closeTime}>
          {i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.CLOSED')}
        </When>
        <Otherwise>
          {i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.OPEN')}
        </Otherwise>
      </Choose>
    </div>
  ),
}];
