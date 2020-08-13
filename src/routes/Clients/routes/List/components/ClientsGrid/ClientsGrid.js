import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { withPermission } from 'providers/PermissionsProvider';
import { getActiveBrandConfig } from 'config';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import PropTypes from 'constants/propTypes';
import { statusColorNames, statusesLabels } from 'constants/user';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import {
  retentionStatuses,
  retentionStatusesColor,
} from 'constants/retentionStatuses';
import {
  lastActivityStatusesLabels,
  lastActivityStatusesColors,
} from 'constants/lastActivity';
import { warningLabels } from 'constants/warnings';
import Grid, { GridColumn } from 'components/Grid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Uuid from 'components/Uuid';
import renderLabel from 'utils/renderLabel';
import './ClientsGrid.scss';

const changeAsquisitionStatusPermission = new Permissions(permissions.USER_PROFILE.CHANGE_ACQUISITION_STATUS);

class ClientsGrid extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    profiles: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profileView),
    }).isRequired,
    searchLimit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    allRowsSelected: PropTypes.bool,
    touchedRowsIds: PropTypes.arrayOf(PropTypes.number),
    permission: PropTypes.permission.isRequired,
    handleAllRowsSelect: PropTypes.func.isRequired,
    handleSelectRow: PropTypes.func.isRequired,
  };

  static defaultProps = {
    allRowsSelected: false,
    touchedRowsIds: [],
    searchLimit: null,
  };

  handlePageChanged = () => {
    const {
      profiles: {
        loadMore,
        loading,
      },
    } = this.props;

    if (!loading) {
      loadMore();
    }
  };

  handleSort = (sortData) => {
    const { history } = this.props;
    const query = get(history, 'location.query') || {};

    const sorts = Object.keys(sortData)
      .filter(sortingKey => sortData[sortingKey])
      .map(sortingKey => ({
        column: sortingKey,
        direction: sortData[sortingKey],
      }));

    history.replace({
      query: {
        ...query,
        sorts,
      },
    });
  };

  handleRowClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  render() {
    const {
      profiles,
      profiles: { loading },
      searchLimit,
      allRowsSelected,
      touchedRowsIds,
      handleSelectRow,
      handleAllRowsSelect,
      permission: {
        permissions: currentPermissions,
      },
    } = this.props;

    const { content: gridData, last } = get(profiles, 'profiles') || { content: [] };

    const isAvailableMultySelect = changeAsquisitionStatusPermission.check(currentPermissions);

    return (
      <Grid
        data={gridData}
        allRowsSelected={allRowsSelected}
        touchedRowsIds={touchedRowsIds}
        handleSort={this.handleSort}
        handleRowClick={this.handleRowClick}
        handleSelectRow={handleSelectRow}
        handleAllRowsSelect={handleAllRowsSelect}
        handlePageChanged={this.handlePageChanged}
        isLoading={loading}
        isLastPage={last}
        withRowsHover
        withMultiSelect={isAvailableMultySelect}
        withLazyLoad={!searchLimit || searchLimit !== gridData.length}
        withNoResults={!loading && gridData.length === 0}
      >
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
          sortBy="firstName"
          render={data => <GridPlayerInfo profile={data} />}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.WARNING')}
          render={({ warnings }) => (
            (warnings && warnings.length) ? warnings.map(warning => (
              <div key={warning}>{I18n.t(renderLabel(warning, warningLabels))}</div>
            )) : null
          )}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_ACTIVITY')}
          render={({ lastActivity, online }) => {
            const lastActivityDate = get(lastActivity, 'date');
            const localTime = lastActivityDate && moment.utc(lastActivityDate).local();
            const type = online ? 'ONLINE' : 'OFFLINE';

            return (
              <GridStatus
                colorClassName={lastActivityStatusesColors[type]}
                statusLabel={I18n.t(lastActivityStatusesLabels[type])}
                info={localTime}
                infoLabel={date => date.fromNow()}
              />
            );
          }}
        />
        <GridColumn
          sortBy="address.countryCode"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY')}
          render={({ address: { countryCode }, languageCode }) => (
            <Choose>
              <When condition={countryCode}>
                <CountryLabelWithFlag
                  code={countryCode}
                  height="14"
                  languageCode={languageCode}
                />
              </When>
              <Otherwise>
                <GridEmptyValue />
              </Otherwise>
            </Choose>
          )}
        />
        <GridColumn
          sortBy="balance.amount"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
          render={(data) => {
            const currency = getActiveBrandConfig().currencies.base;
            const amount = get(data, 'balance.amount') || 0;

            return (
              <div>
                <div className="header-block-middle">
                  {currency} {Number(amount).toFixed(2)}
                </div>
              </div>
            );
          }}
        />
        <GridColumn
          sortBy="paymentDetails.depositsCount"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
          render={(data) => {
            const { depositsCount, lastDepositTime } = get(data, 'paymentDetails') || {};

            return (
              <Choose>
                <When condition={lastDepositTime}>
                  <div className="font-weight-700">{depositsCount}</div>
                  <div className="font-size-11">
                    {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}{' '}
                    {moment(lastDepositTime).format('DD.MM.YYYY')}
                  </div>
                </When>
                <Otherwise>
                  <GridEmptyValue />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE_REFERRER')}
          render={(data) => {
            const { uuid: affiliateUuid, source, campaignId, partner } = get(data, 'affiliate') || {};
            const {
              uuid: referrerUuid,
              fullName: referrerName,
            } = get(data, 'referrer') || {};

            return (
              <Choose>
                <When condition={affiliateUuid}>
                  <If condition={partner}>
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
                  </If>
                  <If condition={source}>
                    <div id={`${data.uuid}`}>
                      <Uuid
                        className="header-block-small"
                        uuidPostfix="..."
                        length={12}
                        uuid={source}
                      />
                    </div>
                    <UncontrolledTooltip
                      placement="bottom-start"
                      target={`${data.uuid}`}
                      delay={{
                        show: 350,
                        hide: 250,
                      }}
                    >
                      {source}
                    </UncontrolledTooltip>
                  </If>
                  <If condition={campaignId}>
                    <div id={`${data.uuid}-campaignId`}>
                      <Uuid
                        className="header-block-small"
                        uuidPostfix="..."
                        length={12}
                        uuid={campaignId}
                      />
                    </div>
                    <UncontrolledTooltip
                      placement="bottom-start"
                      target={`${data.uuid}-campaignId`}
                      delay={{
                        show: 350,
                        hide: 250,
                      }}
                    >
                      {campaignId}
                    </UncontrolledTooltip>
                  </If>
                </When>
                <When condition={referrerUuid}>
                  <div className="header-block-middle">{referrerName}</div>
                  <Uuid
                    className="header-block-small"
                    length={12}
                    uuid={referrerUuid}
                  />
                </When>
                <Otherwise>
                  <GridEmptyValue />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
          render={(data) => {
            const { acquisitionStatus, salesStatus, salesOperator } = get(data, 'acquisition') || {};

            const colorClassName = salesStatusesColor[salesStatus];

            return (
              <Choose>
                <When condition={salesStatus}>
                  <GridStatus
                    wrapperClassName={
                      acquisitionStatus === 'SALES'
                        ? `border-${colorClassName}`
                        : ''
                    }
                    colorClassName={colorClassName}
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
          }}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
          render={(data) => {
            const { acquisitionStatus, retentionStatus, retentionOperator } = get(data, 'acquisition') || {};

            const colorClassName = retentionStatusesColor[retentionStatus];

            return (
              <Choose>
                <When condition={retentionStatus}>
                  <GridStatus
                    wrapperClassName={
                      acquisitionStatus === 'RETENTION'
                        ? `border-${colorClassName}`
                        : ''
                    }
                    colorClassName={colorClassName}
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
          }}
        />
        <GridColumn
          sortBy="registrationDetails.registrationDate"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
          render={({ registrationDetails: { registrationDate } }) => (
            <Fragment>
              <div className="font-weight-700">
                {moment
                  .utc(registrationDate)
                  .local()
                  .format('DD.MM.YYYY')}
              </div>
              <div className="font-size-11">
                {moment
                  .utc(registrationDate)
                  .local()
                  .format('HH:mm:ss')}
              </div>
            </Fragment>
          )}
        />
        <GridColumn
          sortBy="lastNote.changedAt"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE')}
          render={({ uuid, lastNote }) => {
            const { changedAt, content, operator } = lastNote || {};

            return (
              <Choose>
                <When condition={lastNote}>
                  <div className="max-width-200">
                    <div className="font-weight-700">
                      {moment
                        .utc(changedAt)
                        .local()
                        .format('DD.MM.YYYY')}
                    </div>
                    <div className="font-size-11">
                      {moment
                        .utc(changedAt)
                        .local()
                        .format('HH:mm:ss')}
                    </div>
                    <If condition={operator}>
                      <span className="ClientsGrid__noteAuthor">
                        {operator.fullName}
                      </span>
                    </If>
                    <div
                      className="max-height-35 font-size-11 ClientsGrid__notes"
                      id={`note-${uuid}`}
                    >
                      {content}
                    </div>
                    <UncontrolledTooltip
                      placement="bottom-start"
                      target={`note-${uuid}`}
                      delay={{
                        show: 350,
                        hide: 250,
                      }}
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
          }}
        />
        <GridColumn
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
          render={(data) => {
            const { changedAt, type } = get(data, 'status') || {};

            return (
              <Fragment>
                <GridStatus
                  colorClassName={statusColorNames[type]}
                  statusLabel={I18n.t(renderLabel(type, statusesLabels))}
                  info={changedAt}
                  infoLabel={date => (
                    I18n.t('COMMON.SINCE', {
                      date: moment
                        .utc(date)
                        .local()
                        .format('DD.MM.YYYY HH:mm'),
                    })
                  )}
                />
              </Fragment>
            );
          }}
        />
      </Grid>
    );
  }
}

export default compose(
  withPermission,
  withRouter,
)(ClientsGrid);
