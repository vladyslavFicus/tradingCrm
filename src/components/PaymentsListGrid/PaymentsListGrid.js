import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { cloneDeep, set } from 'lodash';
import { withRouter } from 'react-router-dom';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import {
  aggregatorsLabels,
  tradingTypesLabelsWithColor,
} from 'constants/payment';
import { Table, Column } from 'components/Table';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import NoteButton from 'components/NoteButton';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import formatLabel from 'utils/formatLabel';
import './PaymentsListGrid.scss';

class PaymentsListGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    paymentsQuery: PropTypes.shape({
      loading: PropTypes.bool,
      loadMore: PropTypes.func,
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

    return (
      <div className="PaymentsListGrid">
        <Table
          stickyFromTop={headerStickyFromTop}
          items={content}
          sorts={state?.sorts}
          loading={isLoading}
          hasMore={withLazyload && !last}
          onMore={this.handlePageChanged}
          onSort={this.handleSort}
        >
          <Column
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
              header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.CLIENT')}
              render={({ playerProfile, language, paymentId }) => (
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
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE')}
            render={({ paymentType, externalReference }) => {
              const { label, color } = tradingTypesLabelsWithColor[paymentType];
              return (
                <Fragment>
                  <div className={`PaymentsListGrid__upper PaymentsListGrid__text-primary ${color}`}>
                    {I18n.t(label)}
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
              );
            }}
          />
          <Column
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
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.STATUS')}
            render={({
              status,
              paymentId,
              modifiedBy,
              creationTime,
              declineReason,
              withdrawStatus,
              withdrawalScheduledTime,
              statusChangedAt,
            }) => (
              <PaymentStatus
                status={status}
                paymentId={paymentId}
                declineReason={declineReason}
                modifiedBy={modifiedBy}
                creationTime={creationTime}
                statusChangedAt={statusChangedAt}
                withdrawStatus={withdrawStatus}
                withdrawalScheduledTime={withdrawalScheduledTime}
              />
            )}
          />
          <Column
            width={50}
            render={({
              paymentId: targetUUID,
              playerProfile: { uuid: playerUUID },
              note,
            }) => (
              <NoteButton
                key={targetUUID}
                targetType={targetTypes.PAYMENT}
                targetUUID={targetUUID}
                playerUUID={playerUUID}
                note={note}
              />
            )}
          />
        </Table>
      </div>
    );
  }
}

export default withRouter(PaymentsListGrid);
