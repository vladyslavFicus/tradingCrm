import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { startCase } from 'lodash';
import compose from 'compose-function';
import { NetworkStatus } from '@apollo/client';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { getBrand, getBackofficeBrand } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { warningLabels } from 'constants/warnings';
import { statuses, statusesLabels } from 'constants/user';
import { lastActivityStatusesLabels } from 'constants/lastActivity';
import { withPermission } from 'providers/PermissionsProvider';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import { Column, AdjustableTable } from 'components/Table';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import renderLabel from 'utils/renderLabel';
import limitItems from 'utils/limitItems';
import { MAX_SELECTED_CLIENTS, defaultColumns } from '../../constants';
import './ClientsGrid.scss';

class ClientsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    onSelect: PropTypes.func.isRequired,
    permission: PropTypes.permission.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
  }

  handleSort = (sorts) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  handlePageChanged = () => {
    const {
      location,
      location: {
        state,
      },
      clientsQuery: {
        data,
        fetchMore,
        variables,
      },
    } = this.props;

    const { currentPage } = limitItems(data?.profiles, location);
    const filters = state?.filters;
    const sorts = state?.sorts;
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

  handleRowClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  handleSelectError = (select) => {
    const {
      modals: { confirmationModal },
    } = this.props;

    confirmationModal.show({
      onSubmit: confirmationModal.hide,
      modalTitle: `${select.max} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
      actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: select.max }),
      submitButtonLabel: I18n.t('COMMON.OK'),
    });
  };

  renderClientColumn = data => (
    <GridPlayerInfo profile={data} />
  );

  renderWarningColumn = ({ warnings }) => {
    if (!warnings || !warnings.length) {
      return <span>&mdash;</span>;
    }

    return warnings.map(warning => (
      <div key={warning}>{I18n.t(renderLabel(warning, warningLabels))}</div>
    ));
  };

  renderLastActivityColumn = ({ lastActivity, online }) => {
    const localTime = lastActivity?.date && moment.utc(lastActivity?.date).local();
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
        <div className="ClientsGrid__text-secondary">{localTime?.fromNow()}</div>
      </>
    );
  };

  renderCountryColumn = ({ address, languageCode }) => (
    <Choose>
      <When condition={address?.countryCode}>
        <CountryLabelWithFlag
          code={address.countryCode}
          height="14"
          languageCode={languageCode}
        />
      </When>
      <Otherwise>
        <span>&mdash;</span>
      </Otherwise>
    </Choose>
  );

  renderBalanceColumn = ({ balance }) => {
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

  renderDepositColumn = ({ paymentDetails }) => {
    const { depositsCount, lastDepositTime } = paymentDetails || {};

    return (
      <Choose>
        <When condition={lastDepositTime}>
          <div className="ClientsGrid__text-primary">{depositsCount}</div>
          <div className="ClientsGrid__text-secondary">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
            {' '}
            {moment(lastDepositTime).format('DD.MM.YYYY')}
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  };

  renderAffiliateOrReferrerColumn = ({ uuid, affiliate, referrer }) => {
    const { uuid: affiliateUuid, source, campaignId, partner } = affiliate || {};
    const { uuid: referrerUuid, fullName: referrerName } = referrer || {};

    return (
      <Choose>
        {/* Affiliate */}
        <When condition={affiliate}>
          <If condition={affiliateUuid && partner}>
            <div>
              <Link
                className="ClientsGrid__affiliate"
                to={`/partners/${affiliateUuid}/profile`}
                target="_blank"
              >
                {partner.fullName}
              </Link>
            </div>
          </If>
          <If condition={source}>
            <div>
              <Uuid
                id={`source-${uuid}`}
                className="ClientsGrid__text-secondary"
                uuidPostfix="..."
                length={45}
                uuid={source}
              />
            </div>
            <UncontrolledTooltip
              placement="bottom"
              target={`source-${uuid}`}
              delay={{ show: 0, hide: 0 }}
              fade={false}
            >
              {source}
            </UncontrolledTooltip>
          </If>
          <If condition={campaignId}>
            <div>
              <Uuid
                id={`campaignId-${uuid}`}
                className="ClientsGrid__text-secondary"
                uuidPostfix="..."
                length={12}
                uuid={campaignId}
              />
            </div>
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
        <When condition={referrer}>
          <If condition={referrerName}>
            <div className="ClientsGrid__referrer">{referrerName}</div>
          </If>
          <If condition={referrerUuid}>
            <Uuid
              className="ClientsGrid__text-secondary"
              uuidPostfix="..."
              length={12}
              uuid={referrerUuid}
            />
          </If>
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

  renderSalesColumn = ({ acquisition }) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus}
      fullName={acquisition?.salesOperator?.fullName}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  renderRetentionColumn = ({ acquisition }) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus}
      fullName={acquisition?.retentionOperator?.fullName}
      hierarchy={acquisition?.retentionOperator?.hierarchy}
    />
  );

  renderRegistrationDateColumn = ({ registrationDetails }) => {
    const { registrationDate } = registrationDetails || {};

    if (!registrationDate) return null;

    return (
      <Fragment>
        <div className="ClientsGrid__text-primary">
          {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
        </div>
        <div className="ClientsGrid__text-secondary">
          {moment.utc(registrationDate).local().format('HH:mm:ss')}
        </div>
      </Fragment>
    );
  }

  renderLastNoteColumn = ({ uuid, lastNote }) => {
    const { changedAt, content, operator } = lastNote || {};

    return (
      <Choose>
        <When condition={lastNote}>
          <div className="ClientsGrid__note">
            <div className="ClientsGrid__text-primary">
              {moment.utc(changedAt).local().format('DD.MM.YYYY')}
            </div>
            <div className="ClientsGrid__text-secondary">
              {moment.utc(changedAt).local().format('HH:mm:ss')}
            </div>
            <If condition={operator}>
              <div className="ClientsGrid__note-author">
                {operator.fullName}
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
  }

  renderLastCallColumn = ({ lastCall }) => {
    const { date, callSystem } = lastCall || {};

    return (
      <Choose>
        <When condition={lastCall}>
          <div className="ClientsGrid__text-primary">
            {moment.utc(date).local().format('DD.MM.YYYY')}
          </div>
          <div className="ClientsGrid__text-secondary">
            {moment.utc(date).local().format('HH:mm:ss')}
          </div>
          <div className="ClientsGrid__text-secondary">
            {startCase(callSystem.toLowerCase())}
          </div>
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

  renderStatusColumn = ({ status }) => {
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
          {I18n.t(renderLabel(type, statusesLabels))}
        </div>

        <div className="ClientsGrid__text-secondary">
          {I18n.t('COMMON.SINCE', {
            date: moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </>
    );
  }

  render() {
    const {
      location,
      clientsQuery,
      permission: {
        allows,
      },
      onSelect,
    } = this.props;

    const isAvailableMultiSelect = allows(permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS);
    const isBalanceAvailable = allows(permissions.USER_PROFILE.BALANCE);

    const { response } = limitItems(clientsQuery?.data?.profiles, location);

    const {
      content = [],
      totalElements = 0,
      last = true,
    } = response;

    // Show loader only if initial load or new variables was applied
    const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(clientsQuery.networkStatus);
    const columnsOrder = getBackofficeBrand()?.tables?.clients?.columnsOrder;

    return (
      <div className="ClientsGrid">
        <AdjustableTable
          type="CLIENT"
          defaultColumns={defaultColumns}
          columnsOrder={columnsOrder}
          stickyFromTop={157}
          items={content}
          totalCount={totalElements}
          loading={isLoading}
          hasMore={!last}
          onMore={this.handlePageChanged}
          sorts={location?.state?.sorts}
          onSort={this.handleSort}
          withMultiSelect={isAvailableMultiSelect}
          maxSelectCount={MAX_SELECTED_CLIENTS}
          onSelect={onSelect}
          onSelectError={this.handleSelectError}
        >
          <Column
            name="firstName"
            sortBy="firstName"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
            render={this.renderClientColumn}
          />
          <Column
            name="warning"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.WARNING')}
            render={this.renderWarningColumn}
          />
          <Column
            name="lastActivityDate"
            sortBy="lastActivity.date"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_ACTIVITY')}
            render={this.renderLastActivityColumn}
          />
          <Column
            name="addressCountryCode"
            sortBy="address.countryCode"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <If condition={isBalanceAvailable}>
            <Column
              name="balance"
              sortBy="balance.amount"
              header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
              render={this.renderBalanceColumn}
            />
          </If>
          <Column
            name="depositsCount"
            sortBy="paymentDetails.depositsCount"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
            render={this.renderDepositColumn}
          />
          <Column
            name="affiliateReferrer"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE_REFERRER')}
            render={this.renderAffiliateOrReferrerColumn}
          />
          <Column
            name="sales"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
            render={this.renderSalesColumn}
          />
          <Column
            name="retention"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
            render={this.renderRetentionColumn}
          />
          <Column
            name="registrationDate"
            sortBy="registrationDetails.registrationDate"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
            render={this.renderRegistrationDateColumn}
          />
          <Column
            name="lastNoteChangedAt"
            sortBy="lastNote.changedAt"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE')}
            render={this.renderLastNoteColumn}
          />
          <Column
            name="lastCallDate"
            sortBy="lastCall.date"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_CALL')}
            render={this.renderLastCallColumn}
          />
          <Column
            name="status"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
            render={this.renderStatusColumn}
          />
        </AdjustableTable>
      </div>
    );
  }
}

export default compose(
  withPermission,
  withRouter,
  withModals({
    confirmationModal: ConfirmActionModal,
  }),
)(ClientsGrid);
