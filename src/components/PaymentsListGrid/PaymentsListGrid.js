import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { cloneDeep, set } from 'lodash';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { getBrand, getBackofficeBrand } from 'config';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import {
  aggregatorsLabels,
  tradingTypes,
  tradingTypesLabels,
} from 'constants/payment';
import formatLabel from 'utils/formatLabel';
import { AdjustableTable, Column } from 'components/Table';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import NoteAction from 'components/Note/NoteAction';
import './PaymentsListGrid.scss';

class PaymentsListGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    paymentsQuery: PropTypes.shape({
      loading: PropTypes.bool,
      loadMore: PropTypes.func,
      refetch: PropTypes.func,
      variables: PropTypes.object,
      data: PropTypes.shape({
        payments: PropTypes.pageable(PropTypes.paymentEntity),
      }),
    }).isRequired,
    handleRefresh: PropTypes.func.isRequired,
    clientView: PropTypes.bool,
    withLazyload: PropTypes.bool,
    withSort: PropTypes.bool,
    headerStickyFromTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    clientView: false,
    withLazyload: true,
    withSort: true,
    headerStickyFromTop: null,
  };

  handlePageChanged = () => {
    const {
      paymentsQuery,
      paymentsQuery: {
        fetchMore,
        variables,
      },
    } = this.props;

    const page = paymentsQuery?.data?.payments?.number || 0;

    fetchMore({
      variables: set(cloneDeep(variables), 'args.page.from', page + 1),
    });
  };

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  render() {
    const {
      location: {
        state,
      },
      clientView,
      handleRefresh,
      paymentsQuery,
      withLazyload,
      withSort,
      headerStickyFromTop,
    } = this.props;

    const { content = [], last = true } = paymentsQuery.data?.payments || {};
    const isLoading = paymentsQuery.loading;
    const columnsOrder = getBackofficeBrand()?.tables?.payments?.columnsOrder;
    return (
      <div className="PaymentsListGrid">
        <AdjustableTable
          columnsOrder={columnsOrder}
          stickyFromTop={headerStickyFromTop}
          items={content}
          sorts={state?.sorts}
          loading={isLoading}
          hasMore={withLazyload && !last}
          onMore={this.handlePageChanged}
          onSort={this.handleSort}
        >
          <Column
            name="transactions"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS')}
            render={data => (
              <Fragment>
                <GridPaymentInfo payment={data} onSuccess={handleRefresh} />
                <If condition={data.userMigrationId}>
                  <div>
                    <Uuid
                      className="PaymentsListGrid__header-block-small"
                      uuidPostfix="..."
                      length={15}
                      uuid={data.userMigrationId}
                    />
                  </div>
                </If>
                <If condition={data.paymentMigrationId}>
                  <div>
                    <Uuid
                      className="PaymentsListGrid__header-block-small"
                      uuidPostfix="..."
                      length={15}
                      uuid={data.paymentMigrationId}
                    />
                  </div>
                </If>
              </Fragment>
            )}
          />
          <If condition={!clientView}>
            <Column
              name="client"
              header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT')}
              render={({ playerProfile, language, paymentId }) => (
                <Choose>
                  <When condition={playerProfile}>
                    <GridPlayerInfo
                      profile={{
                        ...playerProfile,
                        uuid: playerProfile.uuid,
                        languageCode: language,
                      }}
                      id={`transaction-${paymentId}`}
                    />
                  </When>
                  <Otherwise>
                    <Uuid
                      uuid={playerProfile.uuid}
                      uuidPrefix={
                        playerProfile.uuid.indexOf('PLAYER') === -1
                          ? 'PL'
                          : null
                      }
                    />
                  </Otherwise>
                </Choose>
              )}
            />
          </If>
          <Column
            name="affiliate"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AFFILIATE')}
            render={({ partner, playerProfile: { affiliateUuid } }) => (
              <Choose>
                <When condition={partner}>
                  <div>
                    <a
                      className="PaymentsListGrid__partner"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/partners/${affiliateUuid}/profile`}
                    >
                      {partner.fullName}
                    </a>
                  </div>
                  <div className="PaymentsListGrid__text-secondary">
                    <Uuid uuid={affiliateUuid} />
                  </div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            name="originalAgent"
            sortBy={withSort && 'agentName'}
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.ORIGINAL_AGENT')}
            render={({ originalAgent }) => (
              <Choose>
                <When condition={originalAgent}>
                  <div className="PaymentsListGrid__text-primary">
                    {originalAgent.fullName}
                  </div>
                  <div className="PaymentsListGrid__text-secondary">
                    <Uuid uuid={originalAgent.uuid} />
                  </div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <If condition={!clientView}>
            <Column
              name="country"
              sortBy={withSort && 'playerProfileDocument.country'}
              header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.COUNTRY')}
              render={({ playerProfile: { country } }) => (
                <Choose>
                  <When condition={country && country !== 'unknown'}>
                    <CountryLabelWithFlag code={country} height="14" />
                  </When>
                  <Otherwise>
                    <div>&mdash;</div>
                  </Otherwise>
                </Choose>
              )}
            />
          </If>
          <Column
            name="paymentType"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE')}
            render={({ paymentType, externalReference }) => (
              <Fragment>
                <div
                  className={classNames(
                    'PaymentsListGrid__upper',
                    'PaymentsListGrid__text-primary',
                    'PaymentsListGrid__type',
                    {
                      'PaymentsListGrid__type--deposit': paymentType === tradingTypes.DEPOSIT,
                      'PaymentsListGrid__type--withdraw': paymentType === tradingTypes.WITHDRAW,
                      'PaymentsListGrid__type--interest-rate': paymentType === tradingTypes.INTEREST_RATE,
                      'PaymentsListGrid__type--demo-deposit': paymentType === tradingTypes.DEMO_DEPOSIT,
                      'PaymentsListGrid__type--fee': paymentType === tradingTypes.FEE,
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
                <If condition={externalReference}>
                  <div className="PaymentsListGrid__text-secondary PaymentsListGrid__upper">
                    <Uuid
                      uuid={externalReference}
                      length={10}
                      notificationTitle="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.TITLE"
                      notificationMessage="COMMON.NOTIFICATIONS.COPY_FULL_REFERENCE_ID.MESSAGE"
                    />
                  </div>
                </If>
              </Fragment>
            )}
          />
          <Column
            name="amount"
            sortBy={withSort && 'amount'}
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT')}
            render={({ currency, amount, normalizedAmount, cryptoAmount, cryptoCurrency }) => (
              <Fragment>
                <div className="PaymentsListGrid__header-block-middle">
                  {currency} {I18n.toCurrency(amount, { unit: '' })}
                </div>
                <div className="PaymentsListGrid__text-secondary">
                  {`(${getBrand().currencies.base} ${I18n.toCurrency(normalizedAmount, { unit: '' })})`}
                </div>
                <If condition={cryptoAmount && cryptoCurrency}>
                  <span className="PaymentsListGrid__text-secondary">{cryptoCurrency} {cryptoAmount}</span>
                </If>
              </Fragment>
            )}
          />
          <Column
            name="tradingAccount"
            sortBy={withSort && 'login'}
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC')}
            render={({ login, platformType, currency }) => (
              <>
                <div className="PaymentsListGrid__text-primary">
                  <PlatformTypeBadge platformType={platformType}>
                    {login}
                  </PlatformTypeBadge>
                </div>
                <div className="PaymentsListGrid__text-secondary">{currency}</div>
              </>
            )}
          />
          <Column
            name="paymentAggregator"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_AGGREGATOR')}
            render={({ paymentAggregator }) => (
              <Choose>
                <When condition={aggregatorsLabels[paymentAggregator]}>
                  <div className="PaymentsListGrid__text-primary">
                    {I18n.t(aggregatorsLabels[paymentAggregator])}
                  </div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            name="paymentMethod"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD')}
            render={({ paymentMethod, bankName, maskedPan }) => (
              <>
                <If condition={bankName}>
                  <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{bankName}</div>
                </If>
                <Choose>
                  <When condition={paymentMethod}>
                    <div className="PaymentsListGrid__text-primary">{formatLabel(paymentMethod, false)}</div>
                    <If condition={maskedPan && paymentMethod === 'CREDIT_CARD'}>
                      <div className="PaymentsListGrid__text-primary PaymentsListGrid__payment-method">{maskedPan}</div>
                    </If>
                  </When>
                  <Otherwise>
                    <div>&mdash;</div>
                  </Otherwise>
                </Choose>
              </>
            )}
          />
          <Column
            name="creationTime"
            sortBy={withSort && 'creationTime'}
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.DATE_TIME')}
            render={({ creationTime }) => (
              <Fragment>
                <div className="PaymentsListGrid__text-primary">
                  {moment.utc(creationTime).local().format('DD.MM.YYYY')}
                </div>
                <div className="PaymentsListGrid__text-secondary">
                  {moment.utc(creationTime).local().format('HH:mm:ss')}
                </div>
              </Fragment>
            )}
          />
          <Column
            name="status"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.STATUS')}
            render={({
              status,
              paymentId,
              modifiedBy,
              creationTime,
              declineReason,
              statusChangedAt,
            }) => (
              <PaymentStatus
                status={status}
                paymentId={paymentId}
                declineReason={declineReason}
                modifiedBy={modifiedBy}
                creationTime={creationTime}
                statusChangedAt={statusChangedAt}
              />
            )}
          />
          <Column
            name="note"
            width={50}
            render={({
              paymentId: targetUUID,
              playerProfile: { uuid: playerUUID },
              note,
            }) => (
              <NoteAction
                note={note}
                playerUUID={playerUUID}
                targetUUID={targetUUID}
                targetType={targetTypes.PAYMENT}
                onRefetch={paymentsQuery.refetch}
              />
            )}
          />
        </AdjustableTable>
      </div>
    );
  }
}

export default withRouter(PaymentsListGrid);
