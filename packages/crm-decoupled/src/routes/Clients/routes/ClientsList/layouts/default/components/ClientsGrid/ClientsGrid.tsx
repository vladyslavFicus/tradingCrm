import React, { useCallback, Fragment } from 'react';
import { startCase } from 'lodash';
import { QueryResult } from '@apollo/client';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { UncontrolledTooltip } from 'components';
import { TableSelection } from 'types';
import { getBrand } from 'config';
import Uuid from 'components/Uuid';
import Link from 'components/Link';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import NoteAction from 'components/Note/NoteAction';
import Click2Call from 'components/Click2Call';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { AdjustableTable, Column } from 'components/Table';
import renderLabel from 'utils/renderLabel';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ProfileView,
  Sort__Input as Sort,
  GridConfig__Types__Enum as GridConfigTypes,
} from '__generated__/types';
import { MAX_SELECTED_CLIENTS, defaultColumns } from 'routes/Clients/routes/ClientsList/constants';
import { ClientsListQuery } from 'routes/Clients/routes/ClientsList/graphql/__generated__/ClientsQuery';
import useClientsGrid from 'routes/Clients/routes/ClientsList/hooks/useClientsGrid';
import { Hierarchy } from 'components/GridAcquisitionStatus/hooks/useGridAcquisitionStatus';
import { lastActivityStatusesLabels } from 'constants/lastActivity';
import { statuses, statusesLabels } from 'constants/user';
import { warningLabels } from 'constants/warnings';
import { targetTypes } from 'constants/note';
import './ClientsGrid.scss';

type Props = {
  sorts: Array<Sort>,
  clientsQuery: QueryResult<ClientsListQuery>,
  onSelect: (selectedClients: TableSelection) => void,
};

const ClientsGrid = (props: Props) => {
  const {
    sorts,
    clientsQuery,
    onSelect,
  } = props;

  const {
    isAvailableMultiSelect,
    isBalanceAvailable,
    content,
    totalElements,
    last,
    isLoading,
    columnsOrder,
    handleSort,
    handlePageChanged,
    handleSelectError,
    allowAddNote,
  } = useClientsGrid({ sorts, clientsQuery });


  const renderClientColumn = useCallback((profile: ProfileView) => (
    <GridPlayerInfo profile={profile} />
  ), []);

  const renderWarningColumn = useCallback(({ warnings }: ProfileView) => {
    if (!warnings || !warnings.length) {
      return <>&mdash;</>;
    }

    return warnings.map(warning => (
      <Fragment key={warning}>{I18n.t(renderLabel(warning as string, warningLabels))}</Fragment>
    ));
  }, []);

  const renderLastActivityColumn = useCallback(({ lastActivity, online }: ProfileView) => {
    const localTime = lastActivity?.date && moment.utc(lastActivity?.date).local().fromNow();
    const activityStatus = online ? 'ONLINE' : 'OFFLINE';

    return (
      <>
        <div
          className={classNames('ClientsGrid__text-primary', 'ClientsGrid__text-primary--uppercase', {
            'ClientsGrid__last-activity--offline': !online,
            'ClientsGrid__last-activity--online': online,
          })}
        >
          {I18n.t(lastActivityStatusesLabels[activityStatus])}
        </div>

        <div className="ClientsGrid__text-secondary">{localTime}</div>
      </>
    );
  }, []);

  const renderCountryColumn = useCallback(({ address, languageCode }: ProfileView) => (
    <Choose>
      <When condition={!!address?.countryCode}>
        <CountryLabelWithFlag
          code={address?.countryCode}
          height="14"
          languageCode={languageCode}
        />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderBalanceColumn = useCallback(({ balance }: ProfileView) => {
    const currency = getBrand().currencies.base;
    const amount = balance?.amount || 0;

    return (
      <div className="ClientsGrid__balance">
        {currency} {I18n.toCurrency(amount, { unit: '' })}
      </div>
    );
  }, []);

  const renderDepositColumn = useCallback(({ paymentDetails }: ProfileView) => {
    const { depositsCount, lastDepositTime } = paymentDetails || {};

    return (
      <Choose>
        <When condition={!!lastDepositTime}>
          <div className="ClientsGrid__text-primary">{depositsCount}</div>

          <div className="ClientsGrid__text-secondary">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
            {' '}
            {moment(lastDepositTime as string).format('DD.MM.YYYY')}
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderAffiliateOrReferrerColumn = useCallback(({ uuid, affiliate, referrer }: ProfileView) => {
    const { uuid: affiliateUuid, source, campaignId, partner } = affiliate || {};
    const { uuid: referrerUuid, fullName: referrerName } = referrer || {};

    return (
      <Choose>
        {/* Affiliate */}
        <When condition={!!affiliate}>
          <If condition={!!affiliateUuid && !!partner}>
            <div>
              <Link
                className="ClientsGrid__affiliate"
                to={`/partners/${affiliateUuid}`}
                target="_blank"
              >
                {partner?.fullName}
              </Link>
            </div>
          </If>

          <If condition={!!source}>
            <Uuid
              id={`source-${uuid}`}
              className="ClientsGrid__text-secondary"
              uuidPostfix="..."
              length={45}
              uuid={source || ''}
            />

            <UncontrolledTooltip
              placement="bottom"
              target={`source-${uuid}`}
              delay={{ show: 0, hide: 0 }}
              fade={false}
            >
              {source}
            </UncontrolledTooltip>
          </If>

          <If condition={!!campaignId}>
            <Uuid
              id={`campaignId-${uuid}`}
              className="ClientsGrid__text-secondary"
              uuidPostfix="..."
              length={12}
              uuid={campaignId || ''}
            />

            <UncontrolledTooltip
              placement="bottom"
              target={`campaignId-${uuid}`}
              delay={{ show: 0, hide: 0 }}
              fade={false}
            >
              {campaignId}
            </UncontrolledTooltip>
          </If>
        </When>

        {/* Referrer */}
        <When condition={!!referrer}>
          <If condition={!!referrerName}>
            <div className="ClientsGrid__referrer">{referrerName}</div>
          </If>

          <If condition={!!referrerUuid}>
            <Uuid
              className="ClientsGrid__text-secondary"
              uuidPostfix="..."
              length={12}
              uuid={referrerUuid || ''}
            />
          </If>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderSalesColumn = useCallback(({ acquisition }: ProfileView) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus as string}
      fullName={acquisition?.salesOperator?.fullName as string}
      hierarchy={acquisition?.salesOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRetentionColumn = useCallback(({ acquisition }: ProfileView) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus as string}
      fullName={acquisition?.retentionOperator?.fullName as string}
      hierarchy={acquisition?.retentionOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRegistrationDateColumn = useCallback(({ registrationDetails }: ProfileView) => {
    const { registrationDate } = registrationDetails || {};

    if (!registrationDate) return null;

    return (
      <>
        <div className="ClientsGrid__text-primary">
          {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
        </div>

        <div className="ClientsGrid__text-secondary">
          {moment.utc(registrationDate).local().format('HH:mm:ss')}
        </div>
      </>
    );
  }, []);

  const renderLastNoteColumn = useCallback(({ uuid, lastNote }: ProfileView) => {
    const { changedAt, content: lastNoteContent, operator } = lastNote || {};

    return (
      <Choose>
        <When condition={!!lastNote}>
          <div className="ClientsGrid__note">
            <div className="ClientsGrid__text-primary">
              {moment.utc(changedAt).local().format('DD.MM.YYYY')}
            </div>

            <div className="ClientsGrid__text-secondary">
              {moment.utc(changedAt).local().format('HH:mm:ss')}
            </div>

            <If condition={!!operator}>
              <div className="ClientsGrid__note-author">
                {operator?.fullName}
              </div>
            </If>

            <div
              className="ClientsGrid__note-content"
              id={`note-${uuid}`}
            >
              {lastNoteContent}
            </div>

            <UncontrolledTooltip
              placement="bottom-start"
              target={`note-${uuid}`}
              delay={{ show: 350, hide: 250 }}
              fade={false}
            >
              {lastNoteContent}
            </UncontrolledTooltip>
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderLastCallColumn = useCallback(({ lastCall }: ProfileView) => {
    const { date, callSystem } = lastCall || {};

    return (
      <Choose>
        <When condition={!!lastCall}>
          <div className="ClientsGrid__text-primary">
            {moment.utc(date as string).local().format('DD.MM.YYYY')}
          </div>

          <div className="ClientsGrid__text-secondary">
            {moment.utc(date as string).local().format('HH:mm:ss')}
          </div>

          <div className="ClientsGrid__text-secondary">
            {startCase(callSystem?.toLowerCase())}
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }, []);

  const renderStatusColumn = useCallback(({ status }: ProfileView) => {
    const { changedAt, type } = status || {};

    return (
      <>
        <div
          className={classNames(
            'ClientsGrid__text-primary',
            'ClientsGrid__text-primary--uppercase',
            'ClientsGrid__status',
            {
              'ClientsGrid__status--verified': type === statuses.VERIFIED,
              'ClientsGrid__status--not-verified': type === statuses.NOT_VERIFIED,
              'ClientsGrid__status--blocked': type === statuses.BLOCKED,
            },
          )}
        >
          {I18n.t(renderLabel(type as string, statusesLabels))}
        </div>

        <div className="ClientsGrid__text-secondary">
          {I18n.t('COMMON.SINCE', {
            date: moment.utc(changedAt || '').local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </>
    );
  }, []);

  const renderActionsColumn = useCallback(({ uuid }: ProfileView) => (
    <div className="ClientsGrid__actions">
      <Click2Call
        uuid={uuid}
        phoneType={PhoneType.PHONE}
        customerType={CustomerType.PROFILE}
        position="left"
      />

      <If condition={allowAddNote}>
        <span className="ClientsGrid__note-button">
          <NoteAction
            playerUUID={uuid}
            targetUUID={uuid}
            targetType={targetTypes.PLAYER}
          />
        </span>
      </If>
    </div>
  ), [allowAddNote]);

  return (
    <div className="ClientsGrid">
      <AdjustableTable
        type={GridConfigTypes.CLIENT}
        defaultColumns={defaultColumns}
        columnsOrder={columnsOrder}
        stickyFromTop={157}
        items={content}
        totalCount={totalElements}
        loading={isLoading}
        hasMore={!last}
        onMore={handlePageChanged}
        sorts={sorts}
        onSort={handleSort}
        withMultiSelect={isAvailableMultiSelect}
        maxSelectCount={MAX_SELECTED_CLIENTS}
        onSelect={onSelect}
        onSelectError={handleSelectError}
      >
        <Column
          name="firstName"
          sortBy="firstName"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
          render={renderClientColumn}
        />

        <Column
          name="warning"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.WARNING')}
          render={renderWarningColumn}
        />

        <Column
          name="lastActivityDate"
          sortBy="lastActivity.date"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_ACTIVITY')}
          render={renderLastActivityColumn}
        />

        <Column
          name="addressCountryCode"
          sortBy="address.countryCode"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY')}
          render={renderCountryColumn}
        />

        <If condition={isBalanceAvailable}>
          <Column
            name="balance"
            sortBy="balance.amount"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
            render={renderBalanceColumn}
          />
        </If>

        <Column
          name="depositsCount"
          sortBy="paymentDetails.depositsCount"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
          render={renderDepositColumn}
        />

        <Column
          name="affiliateReferrer"
          sortBy="affiliate.fullName"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE_REFERRER')}
          render={renderAffiliateOrReferrerColumn}
        />

        <Column
          name="sales"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
          render={renderSalesColumn}
        />

        <Column
          name="retention"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
          render={renderRetentionColumn}
        />

        <Column
          name="registrationDate"
          sortBy="registrationDetails.registrationDate"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
          render={renderRegistrationDateColumn}
        />

        <Column
          name="lastNoteChangedAt"
          sortBy="lastNote.changedAt"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE')}
          render={renderLastNoteColumn}
        />

        <Column
          name="lastCallDate"
          sortBy="lastCall.date"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_CALL')}
          render={renderLastCallColumn}
        />

        <Column
          name="status"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
          render={renderStatusColumn}
        />

        <Column
          name="actions"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.ACTIONS')}
          render={renderActionsColumn}
        />
      </AdjustableTable>
    </div>
  );
};

export default React.memo(ClientsGrid);
