import React, { Fragment } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { startCase } from 'lodash';
import compose from 'compose-function';
import { NetworkStatus, QueryResult } from '@apollo/client';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { Modal, Pageable, State } from 'types';
import { getBrand, getBackofficeBrand } from 'config';
import permissions from 'config/permissions';
import { targetTypes } from 'constants/note';
import { warningLabels } from 'constants/warnings';
import { statuses, statusesLabels } from 'constants/user';
import { lastActivityStatusesLabels } from 'constants/lastActivity';
import { usePermission } from 'providers/PermissionsProvider';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import NoteAction from 'components/Note/NoteAction';
import Click2Call from 'components/Click2Call';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { AdjustableTable, Column } from 'components/Table';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import PermissionContent from 'components/PermissionContent';
import renderLabel from 'utils/renderLabel';
import limitItems from 'utils/limitItems';
import {
  ClickToCall__Phone__Type__Enum as PhoneType,
  ClickToCall__Customer__Type__Enum as CustomerType,
  ProfileView,
  Sort__Input as Sort,
  GridConfig__Types__Enum as GridConfigTypes,
} from '__generated__/types';
import { MAX_SELECTED_CLIENTS, defaultColumns } from '../../constants';
import { ClientsListQuery, ClientsListQueryVariables } from '../../graphql/__generated__/ClientsQuery';
import './ClientsGrid.scss';

type TableSelection = {
  all: boolean,
  max: number,
  selected: number,
  touched: Array<number>,
  reset: () => void,
};

type Props = {
  modals: {
    confirmationModal: Modal,
  },
  sorts: Array<Sort>,
  clientsQuery: QueryResult<ClientsListQuery>,
  onSelect: () => void,
};

const ClientsGrid = (props: Props) => {
  const {
    modals: {
      confirmationModal,
    },
    sorts,
    clientsQuery,
    onSelect,
  } = props;

  const location = useLocation<State<ClientsListQueryVariables>>();
  const { state } = location;
  const history = useHistory();
  const permission = usePermission();

  const { data, fetchMore, variables, networkStatus } = clientsQuery;

  const handleSort = (sort: Array<Sort>) => {
    history.replace({
      state: {
        ...state,
        sorts: sort,
      },
    });
  };

  const handlePageChanged = () => {
    const { currentPage } = limitItems(data?.profiles as Pageable<ProfileView>, location);
    const filters = state?.filters;
    const size = variables?.args?.page?.size;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: currentPage + 1,
            size,
            sorts,
          },
        },
      },
    });
  };

  const handleSelectError = (select: TableSelection) => {
    confirmationModal.show({
      onSubmit: confirmationModal.hide,
      modalTitle: `${select.max} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
      hideCancel: true,
    });
  };

  const renderClientColumn = (profile: ProfileView) => (
    <GridPlayerInfo profile={profile} />
  );

  const renderWarningColumn = ({ warnings }: ProfileView) => {
    if (!warnings || !warnings.length) {
      return <>&mdash;</>;
    }

    return warnings.map(warning => (
      <Fragment key={warning}>{I18n.t(renderLabel(warning as string, warningLabels))}</Fragment>
    ));
  };

  const renderLastActivityColumn = ({ lastActivity, online }: ProfileView) => {
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
  };

  const renderCountryColumn = ({ address, languageCode }: ProfileView) => (
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
  );

  const renderBalanceColumn = ({ balance }: ProfileView) => {
    const currency = getBrand().currencies.base;
    const amount = balance?.amount || 0;

    return (
      <div>
        <div className="ClientsGrid__balance">
          {currency} {I18n.toCurrency(amount, { unit: '' })}
        </div>
      </div>
    );
  };

  const renderDepositColumn = ({ paymentDetails }: ProfileView) => {
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
  };

  const renderAffiliateOrReferrerColumn = ({ uuid, affiliate, referrer }: ProfileView) => {
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
                to={`/partners/${affiliateUuid}/profile`}
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
  };

  const renderSalesColumn = ({ acquisition }: ProfileView) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus as string}
      fullName={acquisition?.salesOperator?.fullName as string}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  const renderRetentionColumn = ({ acquisition }: ProfileView) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus as string}
      fullName={acquisition?.retentionOperator?.fullName as string}
      hierarchy={acquisition?.retentionOperator?.hierarchy}
    />
  );

  const renderRegistrationDateColumn = ({ registrationDetails }: ProfileView) => {
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
  };

  const renderLastNoteColumn = ({ uuid, lastNote }: ProfileView) => {
    const { changedAt, content, operator } = lastNote || {};

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
              {content}
            </div>

            <UncontrolledTooltip
              placement="bottom-start"
              target={`note-${uuid}`}
              delay={{ show: 350, hide: 250 }}
              fade={false}
            >
              {content}
            </UncontrolledTooltip>
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  };

  const renderLastCallColumn = ({ lastCall }: ProfileView) => {
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
  };

  const renderStatusColumn = ({ status }: ProfileView) => {
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
  };

  const renderActionsColumn = ({ uuid }: ProfileView) => (
    <div className="ClientsGrid__actions">
      <Click2Call
        uuid={uuid}
        phoneType={PhoneType.PHONE}
        customerType={CustomerType.PROFILE}
        position="left"
      />

      <PermissionContent permissions={permissions.NOTES.ADD_NOTE}>
        <span className="ClientsGrid__note-button">
          <NoteAction
            playerUUID={uuid}
            targetUUID={uuid}
            targetType={targetTypes.PLAYER}
          />
        </span>
      </PermissionContent>
    </div>
  );

  const isAvailableMultiSelect = permission.allows(permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS);
  const isBalanceAvailable = permission.allows(permissions.USER_PROFILE.BALANCE);

  const { response } = limitItems(data?.profiles as Pageable<ProfileView>, location);

  const {
    content = [],
    totalElements = 0,
    last = true,
  } = response;

  // Show loader only if initial load or new variables was applied
  const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(networkStatus);
  const columnsOrder = getBackofficeBrand()?.tables?.clients?.columnsOrder || [];

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

export default compose(
  React.memo,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(ClientsGrid);
