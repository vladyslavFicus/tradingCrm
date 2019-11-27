/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { getActiveBrandConfig } from 'config';
import { targetTypes } from 'constants/note';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import NoteButton from 'components/NoteButton';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import {
  methodsLabels,
  tradingTypesLabelsWithColor,
  manualPaymentMethodsLabels,
  aggregatorsLabels,
} from '../../constants/payment';

const clientColumn = () => ({
  name: 'profile',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT'),
  render: ({ playerProfile, language, paymentId }) => (
    <Choose>
      <When condition={playerProfile}>
        <GridPlayerInfo
          profile={{
            ...playerProfile,
            playerUUID: playerProfile.uuid,
            languageCode: language,
          }}
          id={`transaction-${paymentId}`}
        />
      </When>
      <Otherwise>
        <Uuid uuid={playerProfile.uuid} uuidPrefix={playerProfile.uuid.indexOf('PLAYER') === -1 ? 'PL' : null} />
      </Otherwise>
    </Choose>
  ),
});

const countryColumn = () => ({
  name: 'country',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY'),
  render: ({ playerProfile: { country } }) => (
    <Choose>
      <When condition={country && country !== 'unknown'}>
        <CountryLabelWithFlag
          code={country}
          height="14"
        />
      </When>
      <Otherwise>
        <div>&mdash;</div>
      </Otherwise>
    </Choose>
  ),
});

export default ({
  paymentInfo: { onSuccess },
  clientView,
}) => [{
  name: 'paymentId',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS'),
  render: data => (
    <Fragment>
      <GridPaymentInfo payment={data} onSuccess={onSuccess} />
      <If condition={data.userMigrationId}>
        <div>
          <Uuid className="header-block-small" uuidPostfix="..." length={15} uuid={data.userMigrationId} />
        </div>
      </If>
      <If condition={data.paymentMigrationId}>
        <div>
          <Uuid className="header-block-small" uuidPostfix="..." length={15} uuid={data.paymentMigrationId} />
        </div>
      </If>
    </Fragment>
  ),
},
...(!clientView ? [clientColumn()] : []),
{
  name: 'originalAgent',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.ORIGINAL_AGENT'),
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
},
...(!clientView ? [countryColumn()] : []),
{
  name: 'paymentType',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE'),
  render: ({ paymentType, externalReference }) => {
    const { label, color } = tradingTypesLabelsWithColor[paymentType];
    return (
      <Fragment>
        <div className={`text-uppercase font-weight-700 ${color}`}>{I18n.t(label)}</div>
        <If condition={externalReference}>
          <div className="font-size-11 text-uppercase">
            <Uuid
              uuid={externalReference}
              length={10}
              notificationTitle="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.TITLE"
              notificationMessage="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.MESSAGE"
            />
          </div>
        </If>
      </Fragment>
    );
  },
}, {
  name: 'amount',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT'),
  render: ({ currency, amount, normalizedAmount }) => (
    <Fragment>
      <div className="header-block-middle">{currency} {Number(amount).toFixed(2)}</div>
      <div className="font-size-11">
        {`(${getActiveBrandConfig().currencies.base} ${Number(normalizedAmount).toFixed(2)})`}
      </div>
    </Fragment>
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
                  <div>{paymentMethod}</div>
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
  render: payment => <PaymentStatus payment={payment} />,
}, {
  name: 'actions',
  header: '',
  render({ paymentId: targetUUID, playerProfile: { uuid: playerUUID }, note }) {
    return (
      <NoteButton
        key={targetUUID}
        noteTargetType={targetTypes.PAYMENT}
        targetUUID={targetUUID}
        playerUUID={playerUUID}
        note={note}
      />
    );
  },
}];
