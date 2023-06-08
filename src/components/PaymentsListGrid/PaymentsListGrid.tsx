import React from 'react';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { getBrand, getBackofficeBrand } from 'config';
import { Payment as PaymentInfo, Sort__Input as Sort } from '__generated__/types';
import { NoteEntity } from 'types/Note';
import { targetTypes } from 'constants/note';
import {
  aggregatorsLabels,
  tradingTypes,
  tradingTypesLabels,
  aggregators,
  commissionCurrenciesLabels,
  commissionCurrencies,
} from 'constants/payment';
import { AdjustableTable, Column } from 'components/Table';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import NoteAction from 'components/Note/NoteAction';
import formatLabel from 'utils/formatLabel';
import { PaymentFragment as Payment } from 'apollo/fragments/__generated__/Payment';
import './PaymentsListGrid.scss';

type Props = {
  items: Array<Payment>,
  loading: boolean,
  headerStickyFromTop: string | number,
  sorts: Array<Sort>,
  last: boolean,
  clientView?: boolean,
  onRefetch: () => void,
  onFetchMore: () => void,
  onSort: (sorts: Array<Sort>) => void,
};

const PaymentsListGrid = (props: Props) => {
  const { items, loading, headerStickyFromTop, sorts, last, clientView, onRefetch, onFetchMore, onSort } = props;

  const columnsOrder = getBackofficeBrand()?.tables?.payments?.columnsOrder || [];

  // ===== Renders ===== //
  const renderTransactions = (payment: Payment) => (
    <>
      <GridPaymentInfo payment={payment as PaymentInfo} onSuccess={onRefetch} />

      <If condition={!!payment.userMigrationId}>
        <Uuid
          className="PaymentsListGrid__header-block-small"
          uuidPostfix="..."
          length={15}
          uuid={payment.userMigrationId || ''}
        />
      </If>

      <If condition={!!payment.paymentMigrationId}>
        <Uuid
          className="PaymentsListGrid__header-block-small"
          uuidPostfix="..."
          length={15}
          uuid={payment.paymentMigrationId || ''}
        />
      </If>
    </>
  );

  const renderClient = ({ playerProfile, language, paymentId }: Payment) => (
    <GridPlayerInfo
      profile={{
        ...playerProfile,
        languageCode: language,
      }}
      id={`transaction-${paymentId}`}
    />
  );

  const renderAffiliate = ({ partner, playerProfile: { affiliateUuid } }: Payment) => {
    if (!partner || !affiliateUuid) {
      return <>&mdash;</>;
    }

    return (
      <>
        <Link
          className="PaymentsListGrid__partner"
          target="_blank"
          to={`/partners/${affiliateUuid}/profile`}
        >
          {partner.fullName}
        </Link>

        <div className="PaymentsListGrid__text-secondary">
          <Uuid uuid={affiliateUuid} />
        </div>
      </>
    );
  };

  const renderOriginalAgent = ({ originalAgent }: Payment) => {
    if (!originalAgent) {
      return <>&mdash;</>;
    }

    return (
      <>
        <div className="PaymentsListGrid__text-primary">
          {originalAgent.fullName}
        </div>

        <div className="PaymentsListGrid__text-secondary">
          <Uuid uuid={originalAgent.uuid} />
        </div>
      </>
    );
  };

  const renderCountry = ({ playerProfile }: Payment) => {
    if (!playerProfile || !playerProfile.country || playerProfile.country === 'unknown') {
      return <>&mdash;</>;
    }

    return <CountryLabelWithFlag code={playerProfile.country} height="14" />;
  };

  const renderPaymentType = ({ paymentType, externalReference }: Payment) => (
    <>
      <div
        className={classNames(
          'PaymentsListGrid__upper',
          'PaymentsListGrid__text-primary',
          'PaymentsListGrid__type',
          {
            'PaymentsListGrid__type--deposit': paymentType === tradingTypes.DEPOSIT,
            'PaymentsListGrid__type--withdraw': paymentType === tradingTypes.WITHDRAW,
            'PaymentsListGrid__type--interest-rate': paymentType === tradingTypes.INTEREST_RATE,
            'PaymentsListGrid__type--demo-deposit': paymentType === 'DEMO_DEPOSIT', // TODO: check type
            'PaymentsListGrid__type--fee': paymentType === 'FEE', // TODO: check type
            'PaymentsListGrid__type--inactivity-fee': paymentType === tradingTypes.INACTIVITY_FEE,
            'PaymentsListGrid__type--transfer-in': paymentType === tradingTypes.TRANSFER_IN,
            'PaymentsListGrid__type--transfer-out': paymentType === tradingTypes.TRANSFER_OUT,
            'PaymentsListGrid__type--credit-in': paymentType === tradingTypes.CREDIT_IN,
            'PaymentsListGrid__type--credit-out': paymentType === tradingTypes.CREDIT_OUT,
          },
        )}
      >
        {I18n.t(tradingTypesLabels[paymentType])}
      </div>

      <If condition={!!externalReference}>
        <div className="PaymentsListGrid__text-secondary PaymentsListGrid__upper">
          <Uuid
            uuid={externalReference || ''}
            length={10}
            notificationTitle="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.TITLE"
            notificationMessage="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.MESSAGE"
          />
        </div>
      </If>
    </>
  );

  const renderAmount = (payment: Payment) => {
    const { currency, amount, normalizedAmount, cryptoAmount, cryptoCurrency } = payment;

    return (
      <>
        <div className="PaymentsListGrid__header-block-middle">
          {currency} {I18n.toCurrency(amount || 0, { unit: '' })}
        </div>

        <div className="PaymentsListGrid__text-secondary">
          {`(${getBrand().currencies.base} ${I18n.toCurrency(normalizedAmount || 0, { unit: '' })})`}
        </div>

        <If condition={!!cryptoAmount && !!cryptoCurrency}>
          <span className="PaymentsListGrid__text-secondary-crypto">
            {I18n.t(commissionCurrenciesLabels[cryptoCurrency as commissionCurrencies])
              || cryptoCurrency } {cryptoAmount}
          </span>
        </If>
      </>
    );
  };

  const renderTradingAccount = ({ login, platformType, currency }: Payment) => (
    <>
      <div className="PaymentsListGrid__text-primary">
        <PlatformTypeBadge platformType={`${platformType}`}>
          {login}
        </PlatformTypeBadge>
      </div>

      <div className="PaymentsListGrid__text-secondary">{currency}</div>
    </>
  );

  const renderPaymentAggregator = ({ paymentAggregator }: Payment) => {
    if (!paymentAggregator || aggregatorsLabels[paymentAggregator as aggregators]) {
      return <>&mdash;</>;
    }

    return (
      <div className="PaymentsListGrid__text-primary">
        {I18n.t(aggregatorsLabels[paymentAggregator as aggregators])}
      </div>
    );
  };

  const renderPaymentMethod = ({ paymentMethod, bankName, maskedPan }: Payment) => (
    <>
      <If condition={!!bankName}>
        <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{bankName}</div>
      </If>

      <Choose>
        <When condition={!!paymentMethod}>
          <div className="PaymentsListGrid__text-primary">{formatLabel(`${paymentMethod}`, false)}</div>

          <If condition={!!maskedPan && paymentMethod === 'CREDIT_CARD'}>
            <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{maskedPan}</div>
          </If>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </>
  );

  const renderCreationTime = ({ creationTime }: Payment) => (
    <>
      <div className="PaymentsListGrid__text-primary">
        {moment.utc(creationTime).local().format('DD.MM.YYYY')}
      </div>

      <div className="PaymentsListGrid__text-secondary">
        {moment.utc(creationTime).local().format('HH:mm:ss')}
      </div>
    </>
  );

  const renderStatus = (payment: Payment) => {
    const { status, paymentId, modifiedBy, creationTime, declineReason, statusChangedAt } = payment;

    return (
      <PaymentStatus
        status={status}
        paymentId={paymentId}
        declineReason={declineReason || ''}
        modifiedBy={modifiedBy || ''}
        creationTime={creationTime}
        statusChangedAt={statusChangedAt || ''}
      />
    );
  };

  const renderNote = ({ paymentId: targetUUID, playerProfile: { uuid: playerUUID }, note }: Payment) => (
    <NoteAction
      note={note as NoteEntity}
      playerUUID={playerUUID}
      targetUUID={targetUUID}
      targetType={targetTypes.PAYMENT}
      onRefetch={onRefetch}
    />
  );

  return (
    <div className="PaymentsListGrid">
      <AdjustableTable
        columnsOrder={columnsOrder}
        stickyFromTop={headerStickyFromTop}
        items={items}
        sorts={sorts}
        loading={loading}
        hasMore={!last}
        onMore={onFetchMore}
        onSort={onSort}
      >
        <Column
          name="transactions"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS')}
          render={renderTransactions}
        />

        <If condition={!clientView}>
          <Column
            name="client"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT')}
            render={renderClient}
          />
        </If>

        <Column
          name="affiliate"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AFFILIATE')}
          render={renderAffiliate}
        />

        <Column
          name="originalAgent"
          sortBy="agentName"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.ORIGINAL_AGENT')}
          render={renderOriginalAgent}
        />

        <If condition={!clientView}>
          <Column
            name="country"
            sortBy="playerProfileDocument.country"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY')}
            render={renderCountry}
          />
        </If>

        <Column
          name="paymentType"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE')}
          render={renderPaymentType}
        />
        <Column
          name="amount"
          sortBy="amount"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT')}
          render={renderAmount}
        />

        <Column
          name="tradingAccount"
          sortBy="login"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC')}
          render={renderTradingAccount}
        />

        <Column
          name="paymentAggregator"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_AGGREGATOR')}
          render={renderPaymentAggregator}
        />

        <Column
          name="paymentMethod"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD')}
          render={renderPaymentMethod}
        />

        <Column
          name="creationTime"
          sortBy="creationTime"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.DATE_TIME')}
          render={renderCreationTime}
        />

        <Column
          name="status"
          header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.STATUS')}
          render={renderStatus}
        />

        <Column
          name="note"
          width={50}
          render={renderNote}
        />
      </AdjustableTable>
    </div>
  );
};

export default React.memo(PaymentsListGrid);
