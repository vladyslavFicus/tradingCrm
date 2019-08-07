/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import moment from 'moment';

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
  render: ({ balance, symbol }) => (
    <Fragment>
      <div className="font-weight-700">
        {symbol} {Number(balance).toFixed(2)}
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
  name: 'tradingStatus',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.TRADING_STATUS'),
  render: ({ isReadOnly, readOnlyUpdateTime, readOnlyUpdatedBy }) => (
    <Fragment>
      <div className="font-weight-700 text-uppercase color-info">
        {I18n.t(`CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.${!isReadOnly ? 'ENABLED' : 'DISABLED'}`)}
      </div>
      <If condition={readOnlyUpdatedBy}>
        <Link to={`/operators/${readOnlyUpdatedBy._id}`}>
          <div className="font-size-11 font-weight-700">
            {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_BY', { updatedBy: readOnlyUpdatedBy.fullName })}
          </div>
        </Link>
      </If>
      <If condition={readOnlyUpdateTime}>
        <div className="font-size-11">
          {I18n.t('CLIENT_PROFILE.ACCOUNTS.TRADING_STATUS.UPDATED_AT', {
            updatedAt: moment(readOnlyUpdateTime).format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </If>
    </Fragment>
  ),
}, {
  name: 'server',
  header: I18n.t('CLIENT_PROFILE.ACCOUNTS.GRID_COLUMNS.SERVER'),
  render: () => <div className="font-weight-700">MT4 Live</div>,
}];
