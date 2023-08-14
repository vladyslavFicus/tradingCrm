import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import classNames from 'classnames';
import moment from 'moment';
import { Config, Utils, Constants } from '@crm/common';
import { LastWithdrawalDepositFragment as TableCell } from 'fragments/__generated__/lastWithdrawalDeposit';
import { Table, Column } from 'components/Table';
import GridPaymentInfo from 'components/GridPaymentInfo';
import GridPlayerInfo from 'components/GridPlayerInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import './DashboardPaymentsGrid.scss';

type Props = {
  data: Array<TableCell>,
  loading: boolean,
  refetch: () => void,
};

const DashboardPaymentsGrid = (props: Props) => {
  const { data = [], loading, refetch } = props;

  const renderTransactions = useCallback((rowCell: TableCell) => (
    <>
      <GridPaymentInfo
        payment={{ ...rowCell,
          originalAgent: { uuid: rowCell.agentId || '', fullName: rowCell.agentName, _id: '' },
          _id: rowCell?.agentId || '',
          accountType: rowCell?.accountType as string,
          login: rowCell?.login as string,
          platformType: rowCell?.platformType as string,
        }}
        onSuccess={refetch}
      />

      <If condition={!!rowCell.userMigrationId}>
        <Uuid
          className="DashboardPaymentsGrid__header-block-small"
          uuidPostfix="..."
          length={15}
          uuid={rowCell.userMigrationId || ''}
        />
      </If>

      <If condition={!!rowCell.paymentMigrationId}>
        <Uuid
          className="DashboardPaymentsGrid__header-block-small"
          uuidPostfix="..."
          length={15}
          uuid={rowCell.paymentMigrationId || ''}
        />
      </If>
    </>
  ), [refetch]);

  const renderClient = useCallback(({ playerProfile, language, paymentId } : TableCell) => (
    <Choose>
      <When condition={!!playerProfile}>
        <GridPlayerInfo
          profile={{
            ...playerProfile,
            languageCode: language,
          }}
          id={`transaction-${paymentId}`}
        />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderAffiliate = useCallback(({ playerProfile }: TableCell) => {
    const { affiliateUuid, affiliateFullName } = playerProfile || {};

    return (
      <Choose>
        <When condition={!!affiliateUuid}>
          <a
            className="DashboardPaymentsGrid__partner"
            target="_blank"
            rel="noopener noreferrer"
            href={`/partners/${affiliateUuid}`}
          >
            {affiliateFullName}
          </a>

          <div className="DashboardPaymentsGrid__text-secondary">
            <Uuid uuid={affiliateUuid || ''} />
          </div>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderOriginalAgent = useCallback(({ agentId, agentName }: TableCell) => (
    <Choose>
      <When condition={!!agentId && !!agentName}>
        <div className="DashboardPaymentsGrid__text-primary">
          {agentName}
        </div>

        <div className="DashboardPaymentsGrid__text-secondary">
          <Uuid uuid={agentId || ''} />
        </div>
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderCountry = useCallback(({ playerProfile }: TableCell) => {
    const { country } = playerProfile || {};

    return (
      <Choose>
        <When condition={!!country && country !== 'unknown'}>
          <CountryLabelWithFlag code={country} height="14" />
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderPaymentType = useCallback((
    payment: { paymentType: keyof typeof Constants.Payment.tradingTypesLabels, externalReference: string },
  ) => {
    const { paymentType, externalReference } = payment;

    return (
      <>
        <div
          className={classNames(
            'DashboardPaymentsGrid__upper',
            'DashboardPaymentsGrid__text-primary',
            'DashboardPaymentsGrid__type',
            {
              'DashboardPaymentsGrid__type--deposit': paymentType === Constants.Payment.tradingTypes.DEPOSIT,
              'DashboardPaymentsGrid__type--withdraw': paymentType === Constants.Payment.tradingTypes.WITHDRAW,
              'DashboardPaymentsGrid__type--interest-rate':
                paymentType === Constants.Payment.tradingTypes.INTEREST_RATE,
              'DashboardPaymentsGrid__type--demo-deposit': paymentType === 'DEMO_DEPOSIT', // TODO: check type
              'DashboardPaymentsGrid__type--fee': paymentType === 'FEE', // TODO: check type
              'DashboardPaymentsGrid__type--inactivity-fee':
                paymentType === Constants.Payment.tradingTypes.INACTIVITY_FEE,
              'DashboardPaymentsGrid__type--transfer-in': paymentType === Constants.Payment.tradingTypes.TRANSFER_IN,
              'DashboardPaymentsGrid__type--transfer-out': paymentType === Constants.Payment.tradingTypes.TRANSFER_OUT,
              'DashboardPaymentsGrid__type--credit-in': paymentType === Constants.Payment.tradingTypes.CREDIT_IN,
              'DashboardPaymentsGrid__type--credit-out': paymentType === Constants.Payment.tradingTypes.CREDIT_OUT,
            },
          )}
        >
          {I18n.t(Constants.Payment.tradingTypesLabels[paymentType])}
        </div>

        <If condition={!!externalReference}>
          <div className="DashboardPaymentsGrid__text-secondary DashboardPaymentsGrid__upper">
            <Uuid
              uuid={externalReference}
              length={10}
              notificationTitle="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.TITLE"
              notificationMessage="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.MESSAGE"
            />
          </div>
        </If>
      </>
    );
  }, []);

  const renderAmount = useCallback((
    { currency, amount, normalizedAmount, cryptoAmount, cryptoCurrency }: TableCell,
  ) => (
    <>
      <div className="DashboardPaymentsGrid__header-block-middle">
        {currency} {I18n.toCurrency(amount || 0, { unit: '' })}
      </div>

      <div className="DashboardPaymentsGrid__text-secondary">
        {`(${Config.getBrand().currencies?.base} ${I18n.toCurrency(normalizedAmount || 0, { unit: '' })})`}
      </div>

      <If condition={!!cryptoAmount && !!cryptoCurrency}>
        <span className="DashboardPaymentsGrid__text-secondary">{cryptoCurrency} {cryptoAmount}</span>
      </If>
    </>
  ), []);

  const renderTradingAccount = useCallback(({ login, platformType, currency }: TableCell) => (
    <>
      <div className="DashboardPaymentsGrid__text-primary">
        <PlatformTypeBadge platformType={`${platformType}`}>
          {login}
        </PlatformTypeBadge>
      </div>

      <div className="DashboardPaymentsGrid__text-secondary">{currency}</div>
    </>
  ), []);

  const renderPaymentAggregator = useCallback((
    payment: { paymentAggregator: keyof typeof Constants.Payment.aggregatorsLabels },
  ) => {
    const { paymentAggregator } = payment;

    return (
      <Choose>
        <When condition={!!Constants.Payment.aggregatorsLabels[paymentAggregator]}>
          <div className="DashboardPaymentsGrid__text-primary">
            {I18n.t(Constants.Payment.aggregatorsLabels[paymentAggregator])}
          </div>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderPaymentMethod = useCallback(({ paymentMethod, bankName, maskedPan }: TableCell) => (
    <>
      <If condition={!!bankName}>
        <div className="DashboardPaymentsGrid__text-primary DashboardPaymentsGrid__payment-method">{bankName}</div>
      </If>

      <Choose>
        <When condition={!!paymentMethod}>
          <div className="DashboardPaymentsGrid__text-primary">{Utils.formatLabel(`${paymentMethod}`, false)}</div>

          <If condition={!!maskedPan && paymentMethod === 'CREDIT_CARD'}>
            <div className="DashboardPaymentsGrid__text-primary DashboardPaymentsGrid__payment-method">{maskedPan}</div>
          </If>
        </When>

        <Otherwise>
          &mdash;
        </Otherwise>
      </Choose>
    </>
  ), []);

  const renderCreationTime = useCallback(({ creationTime }: TableCell) => (
    <>
      <div className="DashboardPaymentsGrid__text-primary">
        {moment.utc(creationTime).local().format('DD.MM.YYYY')}
      </div>

      <div className="DashboardPaymentsGrid__text-secondary">
        {moment.utc(creationTime).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderStatus = useCallback(({
    status,
    paymentId,
    modifiedBy,
    creationTime,
    declineReason,
    statusChangedAt,
  }: TableCell) => (
    <PaymentStatus
      status={status}
      paymentId={paymentId}
      declineReason={declineReason || ''}
      modifiedBy={modifiedBy || ''}
      creationTime={creationTime}
      statusChangedAt={statusChangedAt || ''}
    />
  ), []);

  return (
    <Table items={data} loading={loading}>
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS')}
        render={renderTransactions}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT')}
        render={renderClient}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AFFILIATE')}
        render={renderAffiliate}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.ORIGINAL_AGENT')}
        render={renderOriginalAgent}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY')}
        render={renderCountry}
      />
      <Column
        name="paymentType"
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE')}
        render={renderPaymentType}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT')}
        render={renderAmount}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC')}
        render={renderTradingAccount}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_AGGREGATOR')}
        render={renderPaymentAggregator}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD')}
        render={renderPaymentMethod}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.DATE_TIME')}
        render={renderCreationTime}
      />
      <Column
        header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.STATUS')}
        render={renderStatus}
      />
    </Table>
  );
};

export default React.memo(DashboardPaymentsGrid);
