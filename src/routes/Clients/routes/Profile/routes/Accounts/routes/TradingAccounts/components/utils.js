/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';

export const actionColumn = render => ({
  name: 'actions',
  headerStyle: { width: '5%' },
  render,
});

export default [{
  name: 'tradingAcc',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC'),
  render: ({ name, login, group }) => (
    <Fragment>
      <div className="font-weight-700">
        {name}
      </div>
      <div className="font-size-11">
        MT4ID - {login}
      </div>
      <div className="font-size-11">
        {group}
      </div>
    </Fragment>
  ),
}, {
  name: 'balance',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.BALANCE/EQUITY'),
  render: ({ balance, equity, symbol }) => (
    <Fragment>
      <div className="font-weight-700">
        {symbol} {Number(balance).toFixed(2)}
      </div>
      <div className="font-size-11">
        {symbol} {Number(equity).toFixed(2)}
      </div>
    </Fragment>
  ),
}, {
  name: 'credit',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.CREDIT'),
  render: ({ credit, symbol }) => <div className="font-weight-700">{symbol} {Number(credit).toFixed(2)}</div>,
}, {
  name: 'leverage',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.LEVERAGE'),
  render: ({ leverage }) => <div className="font-weight-700">{leverage}</div>,
}, {
  name: 'server',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER'),
  render: () => <div className="font-weight-700">MT4 Live</div>,
}];
