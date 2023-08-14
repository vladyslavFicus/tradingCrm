import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Config, Utils, Types, Constants } from '@crm/common';
import { Payment as PaymentInfo } from '__generated__/types';
import { PaymentFragment as Payment } from 'fragments/__generated__/Payment';
import { AdjustableTable, Column } from 'components/Table';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import usePaymentsListGrid from 'components/PaymentsListGrid/hooks/usePaymentsListGrid';
import PaymentStatus from 'components/PaymentStatus';
import NoteAction from 'components/Note/NoteAction';
import './PaymentsListGrid.scss';

type Props = {
  items: Array<Payment>,
  loading: boolean,
  headerStickyFromTop: string | number,
  sorts: Array<Types.Sort>,
  last: boolean,
  clientView?: boolean,
  onRefetch: () => void,
  onFetchMore: () => void,
  onSort: (sorts: Array<Types.Sort>) => void,
};

const PaymentsListGrid = (props: Props) => {
  const { items, loading, headerStickyFromTop, sorts, last, clientView, onRefetch, onFetchMore, onSort } = props;

  const { columnsOrder } = usePaymentsListGrid();

  // ===== Renders ===== //
  const renderTransactions = useCallback((payment: Payment) => (
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
  ), []);

  const renderClient = useCallback(({ playerProfile, language, paymentId }: Payment) => (
    <GridPlayerInfo
      profile={{
        ...playerProfile,
        languageCode: language,
      }}
      id={`transaction-${paymentId}`}
    />
  ), []);

  const renderAffiliate = useCallback(({ partner, playerProfile: { affiliateUuid } }: Payment) => {
    if (!partner || !affiliateUuid) {
      return <>&mdash;</>;
    }

    return (
      <>
        <Link
          className="PaymentsListGrid__partner"
          target="_blank"
          to={`/partners/${affiliateUuid}`}
        >
          {partner.fullName}
        </Link>

        <div className="PaymentsListGrid__text-secondary">
          <Uuid uuid={affiliateUuid} />
        </div>
      </>
    );
  }, []);

  const renderOriginalAgent = useCallback(({ originalAgent }: Payment) => {
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
  }, []);

  const renderCountry = useCallback(({ playerProfile }: Payment) => {
    if (!playerProfile || !playerProfile.country || playerProfile.country === 'unknown') {
      return <>&mdash;</>;
    }

    return <CountryLabelWithFlag code={playerProfile.country} height="14" />;
  }, []);

  const renderPaymentType = useCallback(({ paymentType, externalReference }: Payment) => (
    <>
      <div
        className={classNames(
          'PaymentsListGrid__upper',
          'PaymentsListGrid__text-primary',
          'PaymentsListGrid__type',
          {
            'PaymentsListGrid__type--deposit': paymentType === Constants.Payment.tradingTypes.DEPOSIT,
            'PaymentsListGrid__type--withdraw': paymentType === Constants.Payment.tradingTypes.WITHDRAW,
            'PaymentsListGrid__type--interest-rate': paymentType === Constants.Payment.tradingTypes.INTEREST_RATE,
            'PaymentsListGrid__type--demo-deposit': paymentType === 'DEMO_DEPOSIT', // TODO: check type
            'PaymentsListGrid__type--fee': paymentType === 'FEE', // TODO: check type
            'PaymentsListGrid__type--inactivity-fee': paymentType === Constants.Payment.tradingTypes.INACTIVITY_FEE,
            'PaymentsListGrid__type--transfer-in': paymentType === Constants.Payment.tradingTypes.TRANSFER_IN,
            'PaymentsListGrid__type--transfer-out': paymentType === Constants.Payment.tradingTypes.TRANSFER_OUT,
            'PaymentsListGrid__type--credit-in': paymentType === Constants.Payment.tradingTypes.CREDIT_IN,
            'PaymentsListGrid__type--credit-out': paymentType === Constants.Payment.tradingTypes.CREDIT_OUT,
          },
        )}
      >
        {I18n.t(Constants.Payment.tradingTypesLabels[paymentType])}
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
  ), []);

  const renderAmount = useCallback((payment: Payment) => {
    const { currency, amount, normalizedAmount, cryptoAmount, cryptoCurrency } = payment;

    return (
      <>
        <div className="PaymentsListGrid__header-block-middle">
          {currency} {I18n.toCurrency(amount || 0, { unit: '' })}
        </div>

        <div className="PaymentsListGrid__text-secondary">
          {`(${Config.getBrand().currencies.base} ${I18n.toCurrency(normalizedAmount || 0, { unit: '' })})`}
        </div>

        <If condition={!!cryptoAmount && !!cryptoCurrency}>
          <span className="PaymentsListGrid__text-secondary-crypto">
            {I18n.t(Constants.Payment.commissionCurrenciesLabels[
              cryptoCurrency as Constants.Payment.commissionCurrencies
            ]) || cryptoCurrency} {cryptoAmount}
          </span>
        </If>
      </>
    );
  }, []);

  const renderTradingAccount = useCallback(({ login, platformType, currency }: Payment) => (
    <>
      <div className="PaymentsListGrid__text-primary">
        <PlatformTypeBadge platformType={`${platformType}`}>
          {login}
        </PlatformTypeBadge>
      </div>

      <div className="PaymentsListGrid__text-secondary">{currency}</div>
    </>
  ), []);

  const renderPaymentAggregator = useCallback(({ paymentAggregator }: Payment) => {
    if (!paymentAggregator || Constants.Payment.aggregatorsLabels[paymentAggregator as Constants.Payment.aggregators]) {
      return <>&mdash;</>;
    }

    return (
      <div className="PaymentsListGrid__text-primary">
        {I18n.t(Constants.Payment.aggregatorsLabels[paymentAggregator as Constants.Payment.aggregators])}
      </div>
    );
  }, []);

  const renderPaymentMethod = useCallback(({ paymentMethod, bankName, maskedPan }: Payment) => (
    <>
      <If condition={!!bankName}>
        <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{bankName}</div>
      </If>

      <Choose>
        <When condition={!!paymentMethod}>
          <div className="PaymentsListGrid__text-primary">{Utils.formatLabel(`${paymentMethod}`, false)}</div>

          <If condition={!!maskedPan && paymentMethod === 'CREDIT_CARD'}>
            <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{maskedPan}</div>
          </If>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </>
  ), []);

  const renderCreationTime = useCallback(({ creationTime }: Payment) => (
    <>
      <div className="PaymentsListGrid__text-primary">
        {moment.utc(creationTime).local().format('DD.MM.YYYY')}
      </div>

      <div className="PaymentsListGrid__text-secondary">
        {moment.utc(creationTime).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderStatus = useCallback((payment: Payment) => {
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
  }, []);

  const renderNote = useCallback(({ paymentId: targetUUID, playerProfile: { uuid: playerUUID }, note }: Payment) => (
    <NoteAction
      note={note as Types.NoteEntity}
      playerUUID={playerUUID}
      targetUUID={targetUUID}
      targetType={Constants.targetTypes.PAYMENT}
      onRefetch={onRefetch}
    />
  ), []);

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
