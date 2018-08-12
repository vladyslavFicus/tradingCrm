/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import {
  methodsLabels,
  typesLabels,
  customTypesProps,
  customTypes,
  customTypesLabels,
  typesProps,
} from '../../../../../../../../../constants/payment';
import renderLabel from '../../../../../../../../../utils/renderLabel';
import GridPaymentInfo from '../../../../../../../../../components/GridPaymentInfo';
import TransactionStatus from '../../../../../../../../../components/TransactionStatus';
import { paymentAccounts } from '../components/PaymentAddModal/constants';

export default (openModal, loadStatuses) => [{
  name: 'paymentId',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.TRANSACTION'),
  render: data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => openModal({ payment: data })}
    />
  ),
}, {
  name: 'paymentType',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.TYPE'),
  render: data => (
    <Fragment>
      <Choose>
        <When condition={data.transactionTag && data.transactionTag !== customTypes.NORMAL}>
          <div {...customTypesProps[data.transactionTag]}>{renderLabel(data.transactionTag, customTypesLabels)}</div>
        </When>
        <Otherwise>
          <div {...typesProps[data.paymentType]}>{renderLabel(data.paymentType, typesLabels)}</div>
        </Otherwise>
      </Choose>
      <div className="font-size-11 text-uppercase">
        {data.paymentSystemRefs.map((SystemRef, index) => (
          <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
        ))}
      </div>
    </Fragment>
  ),
}, {
  name: 'amount',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.AMOUNT'),
  render: ({ currency, amount: { amount } }) => (
    <div className="header-block-middle">{currency} {Number(amount).toFixed(2)}</div>
  ),
}, {
  name: 'tradingAcc',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC'),
  render: ({ tradingAcc, symbol }) => (
    <Fragment>
      <div className="font-weight-700">
        {tradingAcc}
      </div>
      <div className="font-size-11">
        {symbol}
      </div>
    </Fragment>
  ),
}, {
  name: 'paymentMethod',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.METHOD'),
  render: ({ paymentMethod, paymentAccount, accountType }) => (
    <Choose>
      <When condition={!paymentMethod}>
        <div className="font-weight-700">
          {paymentAccounts.find(item => item.value === accountType).label}
        </div>
      </When>
      <Otherwise>
        <div className="font-weight-700">
          {renderLabel(paymentMethod, methodsLabels)}
        </div>
        <If condition={!!paymentAccount}>
          <span className="font-size-11">
            {paymentAccount}
          </span>
        </If>
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'creationTime',
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.DATE_TIME'),
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
  header: I18n.t('CLIENT_PROFILE.TRANSACTIONS.GRID_COLUMNS.STATUS'),
  render: data => (
    <TransactionStatus
      onLoadStatusHistory={() => loadStatuses(data.playerUUID, data.paymentId)}
      transaction={data}
    />
  ),
}];
