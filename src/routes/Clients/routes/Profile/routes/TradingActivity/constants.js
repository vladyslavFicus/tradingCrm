/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'utils/fake-i18n';
import { getTypeColor } from './utils';

export const filterFormAttributeLabels = {
  trade: {
    label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_LABEL'),
    placeholder: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TRADE_PLACEHOLDER'),
  },
  type: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPE_LABEL'),
  loginIds: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.LOGIN_IDS'),
  symbol: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOL_LABEL'),
  volume: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.VOLUME_LABEL'),
  status: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUS_LABEL'),
  openTimeRange: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.OPEN_TIME_RANGE_LABEL'),
  closeTimeRange: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.CLOSE_TIME_RANGE_LABEL'),
};

export const types = [{
  value: 'OP_BUY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY'),
}, {
  value: 'OP_SELL',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL'),
}, {
  value: 'OP_BUY_LIMIT',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY_LIMIT'),
}, {
  value: 'OP_SELL_LIMIT',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL_LIMIT'),
}, {
  value: 'OP_BUY_STOP',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BUY_STOP'),
}, {
  value: 'OP_SELL_STOP',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.SELL_STOP'),
}, {
  value: 'OP_BALANCE',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.BALANCE'),
}, {
  value: 'OP_CREDIT',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.TYPES.CREDIT'),
}];

export const symbols = [{
  value: 'USDCHF',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDCHF'),
}, {
  value: 'GBPUSD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPUSD'),
}, {
  value: 'EURUSD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURUSD'),
}, {
  value: 'USDJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDJPY'),
}, {
  value: 'USDCAD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.USDCAD'),
}, {
  value: 'AUDUSD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDUSD'),
}, {
  value: 'EURGBP',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURGBP'),
}, {
  value: 'EURAUD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURAUD'),
}, {
  value: 'EURCHF',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURCHF'),
}, {
  value: 'EURJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURJPY'),
}, {
  value: 'GBPCHF',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPCHF'),
}, {
  value: 'CADJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CADJPY'),
}, {
  value: 'GBPJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.GBPJPY'),
}, {
  value: 'AUDNZD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDNZD'),
}, {
  value: 'AUDCAD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDCAD'),
}, {
  value: 'AUDCHF',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDCHF'),
}, {
  value: 'AUDJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.AUDJPY'),
}, {
  value: 'CHFJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CHFJPY'),
}, {
  value: 'EURNZD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURNZD'),
}, {
  value: 'EURCAD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.EURCAD'),
}, {
  value: 'CADCHF',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.CADCHF'),
}, {
  value: 'NZDJPY',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.NZDJPY'),
}, {
  value: 'NZDUSD',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.SYMBOLS.NZDUSD'),
}];

export const statuses = [{
  value: 'OPEN',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.OPEN'),
}, {
  value: 'CLOSED',
  label: I18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.FILTER_FORM.STATUSES.CLOSED'),
}];

export const columns = i18n => [{
  name: 'trade',
  header: i18n.t('CLIENT_PROFILE.TRADING_ACTIVITY.GRID_VIEW.TRADE'),
  render: ({ tradeId }) => (
    <div className="font-weight-700">{tradeId}</div>
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
