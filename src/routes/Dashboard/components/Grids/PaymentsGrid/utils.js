/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import GridPaymentInfo from '../../../../../components/GridPaymentInfo';
import Uuid from '../../../../../components/Uuid';
import GridPlayerInfo from '../../../../../components/GridPlayerInfo';
import CountryLabelWithFlag from '../../../../../components/CountryLabelWithFlag';
import TransactionStatus from '../../../../../components/TransactionStatus';
import renderLabel from '../../../../../utils/renderLabel';
import {
  customTypes as customPaymentTypes,
  methodsLabels,
  typesLabels,
  typesProps, customTypesLabels, customTypesProps,
} from '../../../../../constants/payment';
import paymentAccounts from '../../../../../constants/paymentAccounts';

export default ({ auth, modals, fetchPlayerMiniProfile, loadPaymentStatuses }) => [{
  name: 'paymentId',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS'),
  render: data => (
    <GridPaymentInfo
      payment={data}
      onClick={() => modals.paymentDetail.show({ payment: data })}
    />
  ),
}, {
  name: 'profile',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT'),
  render: ({ playerProfile, playerUUID, paymentId }) => (
    <Choose>
      <When condition={playerProfile}>
        <GridPlayerInfo
          profile={playerProfile}
          id={`transaction-${paymentId}`}
          fetchPlayerProfile={fetchPlayerMiniProfile}
          auth={auth}
        />
      </When>
      <Otherwise>
        <Uuid uuid={playerUUID} uuidPrefix={playerUUID.indexOf('PLAYER') === -1 ? 'PL' : null} />
      </Otherwise>
    </Choose>
  ),
}, {
  name: 'country',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY'),
  render: ({ playerProfile: { countryCode, languageCode } }) => (
    <CountryLabelWithFlag
      code={countryCode}
      height="14"
      languageCode={languageCode}
    />
  ),
}, {
  name: 'paymentType',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE'),
  render: ({ transactionTag, paymentType, paymentSystemRefs }) => (
    <Fragment>
      <Choose>
        <When condition={transactionTag && transactionTag !== customPaymentTypes.NORMAL}>
          <div {...customTypesProps[transactionTag]}>{renderLabel(transactionTag, customTypesLabels)}</div>
        </When>
        <Otherwise>
          <div {...typesProps[paymentType]}>{renderLabel(paymentType, typesLabels)}</div>
        </Otherwise>
      </Choose>
      <div className="font-size-11 text-uppercase">
        {paymentSystemRefs.map((SystemRef, index) => (
          <div key={`${SystemRef}-${index}`}>{SystemRef}</div>
        ))}
      </div>
    </Fragment>
  ),
}, {
  name: 'amount',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT'),
  render: ({ currency, amount: { amount } }) => (
    <div className="header-block-middle">{currency} {Number(amount).toFixed(2)}</div>
  ),
}, {
  name: 'tradingAcc',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC'),
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
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD'),
  render: ({ paymentMethod, paymentAccount, accountType }) => (
    <Choose>
      <When condition={!paymentMethod}>
        <Choose>
          <When condition={accountType}>
            <div className="font-weight-700">
              {paymentAccounts.find(item => item.value === accountType).label}
            </div>
          </When>
          <Otherwise>
            <span>&mdash;</span>
          </Otherwise>
        </Choose>
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
  render: data => (
    <TransactionStatus
      onLoadStatusHistory={() => loadPaymentStatuses(data.playerUUID, data.paymentId)}
      transaction={data}
    />
  ),
}];
