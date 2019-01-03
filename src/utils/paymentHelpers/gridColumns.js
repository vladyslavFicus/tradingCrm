/* eslint-disable react/prop-types */
import React, { Fragment } from 'react';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import classNames from 'classnames';
import GridPaymentInfo from '../../components/GridPaymentInfo';
import Uuid from '../../components/Uuid';
import NoteButton from '../../components/NoteButton';
import GridPlayerInfo from '../../components/GridPlayerInfo';
import CountryLabelWithFlag from '../../components/CountryLabelWithFlag';
import FailedStatusContainer from '../../routes/Payments/routes/List/container/FailedStatusContainer';
import {
  statusMapper,
  tradingTypes,
  methodsLabels,
  tradingTypesLabelsWithColor,
  manualPaymentMethodsLabels,
  aggregatorsLabels,
} from '../../constants/payment';
import { getTradingStatusProps } from './utils';

const clientColumn = (auth, fetchPlayer) => ({
  name: 'profile',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT'),
  render: ({ playerProfile, language, paymentId }) => (
    <Choose>
      <When condition={playerProfile}>
        {/* TODO add GRAPHQL fetch to */}
        <GridPlayerInfo
          profile={{
            ...playerProfile,
            playerUUID: playerProfile.uuid,
            languageCode: language,
          }}
          id={`transaction-${paymentId}`}
          fetchPlayerProfile={fetchPlayer}
          auth={auth}
        />
      </When>
      <Otherwise>
        <Uuid uuid={playerProfile.uuid} uuidPrefix={playerProfile.uuid.indexOf('PLAYER') === -1 ? 'PL' : null} />
      </Otherwise>
    </Choose>
  ),
});

const countryColumn = {
  name: 'country',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY'),
  render: ({ paymentMetadata: { country } }) => (
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
};

export default ({
  paymentInfo: { onSuccess },
  playerInfo,
  clientView,
}) => [{
  name: 'paymentId',
  header: I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS'),
  render: data => (
    <GridPaymentInfo payment={data} onSuccess={onSuccess} />
  ),
},
...(!clientView ? [clientColumn(playerInfo.auth, playerInfo.fetchPlayer)] : []),
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
...(!clientView ? [countryColumn] : []),
{
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
  render: ({ status, paymentId, creationTime, createdBy, paymentType }) => {
    const { color, label } = getTradingStatusProps(status);
    return (
      <div>
        <div className={classNames(color, 'font-weight-700 text-uppercase status')}>
          {label}
          <If condition={paymentType === tradingTypes.DEPOSIT && statusMapper.FAILED.indexOf(status) !== -1}>
            <FailedStatusContainer
              id={`transaction-failure-reason-${paymentId}`}
              paymentId={paymentId}
              uuid={playerInfo.auth.uuid}
            />
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
}, {
  name: 'actions',
  header: '',
  render({ paymentId: targetUUID, playerProfile: { uuid: playerUUID }, note }) {
    return (
      <NoteButton
        key={targetUUID}
        targetUUID={targetUUID}
        playerUUID={playerUUID}
        note={note}
      />
    );
  },
}];
