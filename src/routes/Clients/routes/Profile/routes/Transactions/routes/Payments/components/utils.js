/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import moment from 'moment';
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
  header: 'Transaction',
  render: data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => openModal({ payment: data })}
    />
  ),
}, {
  name: 'paymentType',
  header: 'Type',
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
  header: 'Amount',
  render: ({ currency, amount: { amount } }) => (
    <div className="header-block-middle">{currency} {Number(amount).toFixed(2)}</div>
  ),
}, {
  name: 'tradingAcc',
  header: 'Trading Acc.',
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
  header: 'Method',
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
  header: 'DATE & TIME',
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
  header: 'Status',
  render: data => (
    <TransactionStatus
      onLoadStatusHistory={() => loadStatuses(data.playerUUID, data.paymentId)}
      transaction={data}
    />
  ),
}];
