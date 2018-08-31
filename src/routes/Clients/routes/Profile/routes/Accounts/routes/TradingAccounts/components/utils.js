/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';

export default [{
  name: 'tradingAcc',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_ACC'),
  render: ({ login }) => <div className="font-weight-700">{login}</div>,
}, {
  name: 'server',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER'),
  render: () => <div className="font-weight-700">MT4 Live</div>,
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
}]
