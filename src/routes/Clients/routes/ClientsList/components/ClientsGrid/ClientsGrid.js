import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import { NetworkStatus } from 'apollo-client';
import classNames from 'classnames';
import moment from 'moment';
import I18n from 'i18n-js';
import { withModals } from 'hoc';
import { getBrand } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { warningLabels } from 'constants/warnings';
import { statusColorNames, statusesLabels } from 'constants/user';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import { lastActivityStatusesLabels, lastActivityStatusesColors } from 'constants/lastActivity';
import { withPermission } from 'providers/PermissionsProvider';
import Uuid from 'components/Uuid';
import { Link } from 'components/Link';
import GridStatus from 'components/GridStatus';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import Permissions from 'utils/permissions';
import renderLabel from 'utils/renderLabel';
import limitItems from 'utils/limitItems';
import { MAX_SELECTED_CLIENTS } from '../../constants';
import './ClientsGrid.scss';

const changeAsquisitionStatusPermission = new Permissions(permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS);

class ClientsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number).isRequired,
    updateClientsListState: PropTypes.func.isRequired,
    allRowsSelected: PropTypes.bool.isRequired,
    modals: PropTypes.shape({
      confirmationModal: PropTypes.modalType,
    }).isRequired,
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
  }

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

  handlePageChanged = () => {
    const {
      location,
      location: {
        state,
      },
      clientsQuery: {
        data,
        loadMore,
        variables,
      },
    } = this.props;

    const { currentPage } = limitItems(data?.profiles, location);
    const filters = state?.filters;
    const sorts = state?.sorts;
    const size = variables?.args?.page?.size;

    loadMore({
      args: {
        ...filters,
        page: {
          from: currentPage + 1,
          size,
          sorts,
        },
      },
    });
  };

  handleRowClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  handleSelectRow = (allRowsSelected, touchedRowsIds) => {
    this.props.updateClientsListState(allRowsSelected, touchedRowsIds);
  };

  handleAllRowsSelect = (allRowsSelected) => {
    const { updateClientsListState } = this.props;

    updateClientsListState(allRowsSelected, []);

    if (allRowsSelected) {
      const {
        location,
        clientsQuery,
        modals: { confirmationModal },
      } = this.props;

      const totalElements = clientsQuery.data?.profiles?.totalElements || 0;
      const searchLimit = location?.state?.filters?.searchLimit || null;

      const selectedLimit = (searchLimit && searchLimit < totalElements)
        ? searchLimit > MAX_SELECTED_CLIENTS
        : totalElements > MAX_SELECTED_CLIENTS;

      if (selectedLimit) {
        confirmationModal.show({
          onSubmit: confirmationModal.hide,
          modalTitle: `${MAX_SELECTED_CLIENTS} ${I18n.t('COMMON.CLIENTS_SELECTED')}`,
          actionText: I18n.t('COMMON.NOT_MORE_CAN_SELECTED', { max: MAX_SELECTED_CLIENTS }),
          submitButtonLabel: I18n.t('COMMON.OK'),
        });
      }
    }
  }

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
      <GridStatus
        statusLabel={I18n.t(lastActivityStatusesLabels[activityStatus])}
        colorClassName={lastActivityStatusesColors[activityStatus]}
        infoLabel={date => date.fromNow()}
        info={localTime}
      />
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
          {currency} {Number(amount).toFixed(2)}
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

  renderAffiliateOrReferrerColumn = ({ affiliate, referrer }) => {
    const { uuid: affiliateUuid, source, campaignId, partner } = affiliate || {};
    const { uuid: referrerUuid, fullName: referrerName } = referrer || {};

    return (
      <Choose>
        {/* Affiliate */}
        <When condition={affiliate}>
          <If condition={affiliateUuid}>
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
            <div id={`source-${affiliateUuid}`}>
              <Uuid
                className="ClientsGrid__text-secondary"
                uuidPostfix="..."
                length={12}
                uuid={source}
              />
            </div>
            <UncontrolledTooltip
              placement="bottom-start"
              target={`source-${affiliateUuid}`}
              delay={{ show: 350, hide: 250 }}
            >
              {source}
            </UncontrolledTooltip>
          </If>
          <If condition={campaignId}>
            <div id={`campaignId-${affiliateUuid}`}>
              <Uuid
                className="ClientsGrid__text-secondary"
                uuidPostfix="..."
                length={12}
                uuid={campaignId}
              />
            </div>
            <UncontrolledTooltip
              placement="bottom-start"
              target={`campaignId-${affiliateUuid}`}
              delay={{ show: 350, hide: 250 }}
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

  renderSalesColumn = ({ acquisition }) => {
    const { acquisitionStatus, salesStatus, salesOperator } = acquisition || {};
    const colorClassName = salesStatusesColor[salesStatus];

    return (
      <Choose>
        <When condition={salesStatus}>
          <GridStatus
            colorClassName={colorClassName}
            wrapperClassName={classNames({ [`border-${colorClassName}`]: acquisitionStatus === 'SALES' })}
            statusLabel={I18n.t(renderLabel(salesStatus, salesStatuses))}
            info={(
              <If condition={salesOperator}>
                <GridStatusDeskTeam
                  fullName={salesOperator.fullName}
                  hierarchy={salesOperator.hierarchy}
                />
              </If>
            )}
          />
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

  renderRetentionColumn = ({ acquisition }) => {
    const { acquisitionStatus, retentionStatus, retentionOperator } = acquisition || {};
    const colorClassName = retentionStatusesColor[retentionStatus];

    return (
      <Choose>
        <When condition={retentionStatus}>
          <GridStatus
            colorClassName={colorClassName}
            wrapperClassName={classNames({ [`border-${colorClassName}`]: acquisitionStatus === 'RETENTION' })}
            statusLabel={I18n.t(renderLabel(retentionStatus, retentionStatuses))}
            info={(
              <If condition={retentionOperator}>
                <GridStatusDeskTeam
                  fullName={retentionOperator.fullName}
                  hierarchy={retentionOperator.hierarchy}
                />
              </If>
            )}
          />
        </When>
        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  }

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

  renderStatusColumn = ({ status }) => {
    const { changedAt, type } = status || {};

    return (
      <GridStatus
        colorClassName={statusColorNames[type]}
        statusLabel={I18n.t(renderLabel(type, statusesLabels))}
        info={changedAt}
        infoLabel={date => (
          I18n.t('COMMON.SINCE', {
            date: moment.utc(date).local().format('DD.MM.YYYY HH:mm'),
          })
        )}
      />
    );
  }

  render() {
    const {
      location,
      clientsQuery,
      touchedRowsIds,
      allRowsSelected,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const isAvailableMultySelect = changeAsquisitionStatusPermission.check(currentPermissions);

    const clients = clientsQuery?.data?.profiles;
    const searchLimit = location?.state?.filters?.searchLimit || null;

    const { response } = limitItems(clients, location);
    const { content, last } = response || { content: [] };

    // Show loader only if initial load or new variables was applied
    const isLoading = [NetworkStatus.loading, NetworkStatus.setVariables].includes(clientsQuery.networkStatus);

    return (
      <div className="ClientsGrid">
        <Grid
          data={content}
          touchedRowsIds={touchedRowsIds}
          handleSort={this.handleSort}
          sorts={location?.state?.sortData}
          allRowsSelected={allRowsSelected}
          handleSelectRow={this.handleSelectRow}
          handleRowClick={this.handleRowClick}
          handleAllRowsSelect={this.handleAllRowsSelect}
          handlePageChanged={this.handlePageChanged}
          headerStickyFromTop={154}
          isLoading={isLoading}
          isLastPage={last}
          withLazyLoad={!searchLimit || searchLimit !== content.length}
          withRowsHover
          withMultiSelect={isAvailableMultySelect}
          withNoResults={!isLoading && content.length === 0}
        >
          <GridColumn
            sortBy="firstName"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
            render={this.renderClientColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.WARNING')}
            render={this.renderWarningColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_ACTIVITY')}
            render={this.renderLastActivityColumn}
          />
          <GridColumn
            sortBy="address.countryCode"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY')}
            render={this.renderCountryColumn}
          />
          <GridColumn
            sortBy="balance.amount"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
            render={this.renderBalanceColumn}
          />
          <GridColumn
            sortBy="paymentDetails.depositsCount"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
            render={this.renderDepositColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE_REFERRER')}
            render={this.renderAffiliateOrReferrerColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
            render={this.renderSalesColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
            render={this.renderRetentionColumn}
          />
          <GridColumn
            sortBy="registrationDetails.registrationDate"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
            render={this.renderRegistrationDateColumn}
          />
          <GridColumn
            sortBy="lastNote.changedAt"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE')}
            render={this.renderLastNoteColumn}
          />
          <GridColumn
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
            render={this.renderStatusColumn}
          />
        </Grid>
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
