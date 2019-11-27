/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import {
  statuses,
  methodsLabels,
  manualPaymentMethodsLabels,
  aggregatorsLabels,
  tradingTypesLabelsWithColor,
} from 'constants/payment';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import FailedStatusIcon from 'components/FailedStatusIcon';
import { getTradingStatusProps } from 'utils/paymentHelpers';

export default onActionSuccess => [{
  name: 'paymentId',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.TRANSACTION'),
  render: data => (
    <GridPaymentInfo payment={data} onSuccess={onActionSuccess} />
  ),
}, {
  name: 'paymentType',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE'),
  render: ({ paymentType, externalReference }) => {
    const { label, color } = tradingTypesLabelsWithColor[paymentType];

    return (
      <Fragment>
        <div className={`text-uppercase font-weight-700 ${color}`}>{I18n.t(label)}</div>
        <div className="font-size-11 text-uppercase">
          {externalReference}
        </div>
      </Fragment>
    );
  },
}, {
  name: 'amount',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT'),
  render: ({ currency, amount }) => (
    <div className="header-block-middle">{currency} {Number(amount).toFixed(2)}</div>
  ),
}, {
  name: 'tradingAcc',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC'),
  render: ({ login, currency }) => (
    <Choose>
      <When condition={login}>
        <div className="font-weight-700">
          {login}
        </div>
        <div className="font-size-11">
          {currency}
        </div>
      </When>
      <Otherwise>
        <div className="font-weight-700">
          <span>&mdash;</span>
        </div>
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'paymentAggregator',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_AGGREGATOR'),
  render: ({ paymentAggregator }) => (
    <Choose>
      <When condition={aggregatorsLabels[paymentAggregator]}>
        <div className="font-weight-700">
          {I18n.t(aggregatorsLabels[paymentAggregator])}
        </div>
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'paymentMethod',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD'),
  render: ({ paymentMethod }) => (
    <Choose>
      <When condition={!paymentMethod}>
        <div>&mdash;</div>
      </When>
      <Otherwise>
        <div className="font-weight-700">
          <Choose>
            <When condition={methodsLabels[paymentMethod]}>
              {I18n.t(methodsLabels[paymentMethod])}
            </When>
            <Otherwise>
              <Choose>
                <When condition={manualPaymentMethodsLabels[paymentMethod]}>
                  {I18n.t(manualPaymentMethodsLabels[paymentMethod])}
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            </Otherwise>
          </Choose>
        </div>
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'creationTime',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.DATE_TIME'),
  render: ({ creationTime }) => (
    <Fragment>
      <div className="font-weight-700">
        {moment.utc(creationTime).local().format('DD.MM.YYYY')}
      </div>
      <div className="font-size-11">
        {moment.utc(creationTime).local().format('HH:mm:ss')}
      </div>
    </Fragment>
  ),
}, {
  name: 'status',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.STATUS'),
  render: ({ status, paymentId, reason, creationTime, createdBy }) => {
    const { color, label } = getTradingStatusProps(status);

    return (
      <div>
        <div className={classNames(color, 'font-weight-700 text-uppercase status')}>
          {label}
          <If condition={(status === statuses.FAILED || status === statuses.REJECTED) && !!reason}>
            <FailedStatusIcon id={`transaction-failure-reason-${paymentId}`}>
              {reason}
            </FailedStatusIcon>
          </If>
        </div>
        <div className="font-size-11">
          {I18n.t('COMMON.DATE_ON', {
            date: moment.utc(creationTime).local().format('DD.MM.YYYY - HH:mm:ss'),
          })}
        </div>
        <If condition={createdBy}>
          <div className="font-size-11">
            {I18n.t('COMMON.AUTHOR_BY')}
            {' '}
            <Uuid uuid={createdBy} />
          </div>
        </If>
      </div>
    );
  },
}];
