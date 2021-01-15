import React, { PureComponent, Fragment } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import { get, set } from 'lodash';
import { withRouter } from 'react-router-dom';
import { getBrand } from 'config';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import {
  aggregatorsLabels,
  tradingTypesLabelsWithColor,
} from 'constants/payment';
import Grid, { GridColumn } from 'components/Grid';
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
    withLazyLoad: PropTypes.bool,
    headerStickyFromTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    clientView: false,
    withLazyLoad: true,
    headerStickyFromTop: null,
  };

  handlePageChanged = () => {
    const {
      paymentsQuery,
      paymentsQuery: {
        loadMore,
      },
    } = this.props;

    const page = paymentsQuery?.data?.payments?.number || 0;

    loadMore(variables => set(variables, 'args.page.from', page + 1));
  };

  handleSort = (sortData, sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
        sortData,
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
      withLazyLoad,
      headerStickyFromTop,
    } = this.props;

    const { content, last } = get(paymentsQuery, 'data.payments') || { content: [] };
    const isLoading = paymentsQuery.loading;

    return (
      <div className="PaymentsListGrid card">
        <Grid
          data={content || []}
          handleSort={this.handleSort}
          sorts={state?.sortData}
          handlePageChanged={this.handlePageChanged}
          headerStickyFromTop={headerStickyFromTop}
          isLoading={isLoading}
          isLastPage={last}
          withLazyLoad={withLazyLoad}
          withNoResults={!isLoading && !content.length}
        >
          <GridColumn
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRANSACTIONS')}
            render={data => (
              <Fragment>
                <GridPaymentInfo payment={data} onSuccess={handleRefresh} />
                <If condition={data.userMigrationId}>
                  <div>
                    <Uuid
                      className="header-block-small"
                      uuidPostfix="..."
                      length={15}
                      uuid={data.userMigrationId}
                    />
                  </div>
                </If>
                <If condition={data.paymentMigrationId}>
                  <div>
                    <Uuid
                      className="header-block-small"
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
            <GridColumn
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
          <GridColumn
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AFFILIATE')}
            render={({ partner, playerProfile: { affiliateUuid } }) => (
              <Choose>
                <When condition={partner}>
                  <div>
                    <a
                      className="header-block-middle"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`/partners/${affiliateUuid}/profile`}
                    >
                      {partner.fullName}
                    </a>
                  </div>
                  <div className="font-size-11">
                    <Uuid uuid={affiliateUuid} />
                  </div>
                </When>
                <Otherwise>
                  <div>&mdash;</div>
                </Otherwise>
              </Choose>
            )}
          />
          <GridColumn
            sortBy="agentName"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.ORIGINAL_AGENT')}
            render={({ originalAgent }) => (
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
            )}
          />
          <If condition={!clientView}>
            <GridColumn
              sortBy="playerProfileDocument.country"
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
          <GridColumn
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_TYPE')}
            render={({ paymentType, externalReference }) => {
              const { label, color } = tradingTypesLabelsWithColor[paymentType];
              return (
                <Fragment>
                  <div className={`text-uppercase font-weight-700 ${color}`}>
                    {I18n.t(label)}
                  </div>
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
            }}
          />
          <GridColumn
            sortBy="amount"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.AMOUNT')}
            render={({ currency, amount, normalizedAmount }) => (
              <Fragment>
                <div className="header-block-middle">
                  {currency} {Number(amount).toFixed(2)}
                </div>
                <div className="font-size-11">
                  {`(${getBrand().currencies.base} ${Number(
                    normalizedAmount,
                  ).toFixed(2)})`}
                </div>
              </Fragment>
            )}
          />
          <GridColumn
            sortBy="login"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.TRADING_ACC')}
            render={({ login, platformType, currency }) => (
              <>
                <div className="font-weight-700">
                  <PlatformTypeBadge platformType={platformType}>
                    {login}
                  </PlatformTypeBadge>
                </div>
                <div className="font-size-11">{currency}</div>
              </>
            )}
          />
          <GridColumn
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_AGGREGATOR')}
            render={({ paymentAggregator }) => (
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
            )}
          />
          <GridColumn
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.PAYMENT_METHOD')}
            render={({ paymentMethod, bankName, maskedPan }) => (
              <>
                <If condition={bankName}>
                  <div className="font-weight-700 color-warning">{bankName}</div>
                </If>
                <Choose>
                  <When condition={paymentMethod}>
                    <div className="font-weight-700">{formatLabel(paymentMethod)}</div>
                    <If condition={maskedPan && paymentMethod === 'CREDIT_CARD'}>
                      <div className="font-weight-700 color-warning">{maskedPan}</div>
                    </If>
                  </When>
                  <Otherwise>
                    <div>&mdash;</div>
                  </Otherwise>
                </Choose>
              </>
            )}
          />
          <GridColumn
            sortBy="creationTime"
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.DATE_TIME')}
            render={({ creationTime }) => (
              <Fragment>
                <div className="font-weight-700">
                  {moment.utc(creationTime).local().format('DD.MM.YYYY')}
                </div>
                <div className="font-size-11">
                  {moment.utc(creationTime).local().format('HH:mm:ss')}
                </div>
              </Fragment>
            )}
          />
          <GridColumn
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
          <GridColumn
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
        </Grid>
      </div>
    );
  }
}

export default withRouter(PaymentsListGrid);
