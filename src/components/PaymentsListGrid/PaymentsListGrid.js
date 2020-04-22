import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import moment from 'moment';
import { get, set, cloneDeep } from 'lodash';
import { getActiveBrandConfig } from 'config';
import { targetTypes } from 'constants/note';
import {
  aggregatorsLabels,
  tradingTypesLabelsWithColor,
} from 'constants/payment';
import { warningLabels } from 'constants/warnings';
import Grid, { GridColumn } from 'components/Grid';
import GridPaymentInfo from 'components/GridPaymentInfo';
import Uuid from 'components/Uuid';
import PlatformTypeBadge from 'components/PlatformTypeBadge';
import NoteButton from 'components/NoteButton';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import PaymentStatus from 'components/PaymentStatus';
import formatLabel from 'utils/formatLabel';
import renderLabel from 'utils/renderLabel';

class PaymentsListGrid extends PureComponent {
  static propTypes = {
    paymentsQuery: PropTypes.query({
      clientPayments: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.paymentEntity),
        error: PropTypes.shape({
          error: PropTypes.any,
        }),
      }),
    }).isRequired,
    handleSort: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    clientView: PropTypes.bool,
  };

  static defaultProps = {
    clientView: false,
  };

  handlePageChanged = () => {
    const {
      paymentsQuery: {
        variables: { args },
        loadMore,
        data,
      },
    } = this.props;

    const page = get(data, 'clientPayments.data.number') || 0;

    loadMore(set({ args: cloneDeep(args) }, 'args.page.from', page + 1));
  };

  render() {
    const {
      clientView,
      handleSort,
      handleRefresh,
      paymentsQuery: {
        data: paymentsData,
        loading: paymentsLoading,
      },
    } = this.props;

    const payments = get(paymentsData, 'clientPayments.data') || {
      content: [],
    };

    const paymentsError = get(paymentsData, 'clientPayments.error');

    return (
      <div className="card-body">
        <Grid
          data={payments.content}
          handleSort={handleSort}
          handlePageChanged={this.handlePageChanged}
          isLoading={paymentsLoading}
          isLastPage={payments.last}
          withLazyLoad
          withNoResults={paymentsError}
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
            header={I18n.t('CONSTANTS.TRANSACTIONS.GRID_COLUMNS.WARNING')}
            render={({ warnings }) => (
              <If condition={warnings && warnings.length}>
                {warnings.map(warning => (
                  <div key={warning}>
                    {I18n.t(renderLabel(warning, warningLabels))}
                  </div>
                ))}
              </If>
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
                  {`(${getActiveBrandConfig().currencies.base} ${Number(
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
            render={({ paymentMethod }) => (
              <Choose>
                <When condition={!paymentMethod}>
                  <div>&mdash;</div>
                </When>
                <Otherwise>
                  <div className="font-weight-700">
                    <Choose>
                      <When condition={paymentMethod}>
                        {formatLabel(paymentMethod)}
                      </When>
                      <Otherwise>{paymentMethod}</Otherwise>
                    </Choose>
                  </div>
                </Otherwise>
              </Choose>
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

export default PaymentsListGrid;
