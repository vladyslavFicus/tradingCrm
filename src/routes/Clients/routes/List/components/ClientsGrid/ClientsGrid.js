import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getActiveBrandConfig } from 'config';
import PropTypes from 'constants/propTypes';
import { statusColorNames, statusesLabels } from 'constants/user';
import { fsaStatusColorNames, fsaStatusesLabels } from 'constants/fsaMigration';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import {
  retentionStatuses,
  retentionStatusesColor,
} from 'constants/retentionStatuses';
import { warningLabels } from 'constants/warnings';
import GridView, { GridViewColumn } from 'components/GridView';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { UncontrolledTooltip } from 'components/Reactstrap/Uncontrolled';
import Uuid from 'components/Uuid';
import renderLabel from 'utils/renderLabel';

class ClientsGrid extends PureComponent {
  static propTypes = {
    profiles: PropTypes.query({
      profiles: PropTypes.shape({
        data: PropTypes.pageable(PropTypes.profileView),
      }),
    }).isRequired,
    searchLimit: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  };

  static defaultProps = {
    searchLimit: null,
  };

  handleClientClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
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

  render() {
    const {
      profiles,
      profiles: { loading },
      searchLimit,
      ...props
    } = this.props;

    const {
      content: gridData,
      page: activePage,
      last: isLastPage,
    } = get(profiles, 'profiles.data') || { content: [] };

    return (
      <GridView
        tableClassName="table-hovered"
        dataSource={gridData}
        activePage={activePage}
        last={isLastPage}
        lazyLoad={!searchLimit || searchLimit !== gridData.length}
        showNoResults={!loading && gridData.length === 0}
        loading={loading && gridData.length === 0}
        multiselect
        onPageChange={this.handlePageChanged}
        onRowClick={this.handleClientClick}
        {...props}
      >
        <GridViewColumn
          name="client"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
          render={data => <GridPlayerInfo profile={data} />}
        />
        <GridViewColumn
          name="warning"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.WARNING')}
          render={({ warnings }) => (
            (warnings && warnings.length) ? warnings.map(warning => (
              <div key={warning}>{I18n.t(renderLabel(warning, warningLabels))}</div>
            )) : null
          )}
        />
        <GridViewColumn
          name="lastActivity"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_ACTIVITY')}
          render={({ lastActivity }) => {
            const date = get(lastActivity, 'date');
            return (date && (
              <div>
                {moment
                  .utc(date)
                  .local()
                  .fromNow()}
              </div>
            ));
          }}
        />
        <GridViewColumn
          name="country"
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
                <GridEmptyValue I18n={I18n} />
              </Otherwise>
            </Choose>
          )}
        />
        <GridViewColumn
          name="balance"
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
        <GridViewColumn
          name="deposits"
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
                  <GridEmptyValue I18n={I18n} />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridViewColumn
          name="affiliate"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE')}
          render={(data) => {
            const { uuid, source, campaignId, partner } = get(data, 'affiliate') || {};

            return (
              <Choose>
                <When condition={uuid}>
                  <If condition={partner}>
                    <div>
                      <a
                        className="header-block-middle"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`/partners/${uuid}/profile`}
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
                <Otherwise>
                  <GridEmptyValue I18n={I18n} />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridViewColumn
          name="sales"
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
                  <GridEmptyValue I18n={I18n} />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridViewColumn
          name="retention"
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
                  <GridEmptyValue I18n={I18n} />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridViewColumn
          name="registrationDate"
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
        <GridViewColumn
          name="lastNote"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.LAST_NOTE')}
          render={(data) => {
            const { uuid, changedAt, content } = get(data, 'lastNote') || {};

            return (
              <Choose>
                <When condition={uuid}>
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
                    <div
                      className="text-truncate-2-lines max-height-35 font-size-11"
                      id={`${uuid}-note`}
                    >
                      {content}
                    </div>
                    <UncontrolledTooltip
                      placement="bottom-start"
                      target={`${uuid}-note`}
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
                  <GridEmptyValue I18n={I18n} />
                </Otherwise>
              </Choose>
            );
          }}
        />
        <GridViewColumn
          name="status"
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
          render={(data) => {
            const { changedAt, type } = get(data, 'status') || {};
            const { agreedToFsaMigrationDate, fsaMigrationStatus } = get(data, 'fsaMigrationInfo') || {};

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
                <If
                  condition={
                    getActiveBrandConfig().fsaRegulation && fsaMigrationStatus
                  }
                >
                  <GridStatus
                    colorClassName={`${fsaStatusColorNames[fsaMigrationStatus]} margin-top-5`}
                    statusLabel={I18n.t(renderLabel(fsaMigrationStatus, fsaStatusesLabels))}
                    info={agreedToFsaMigrationDate}
                    infoLabel={date => (
                      I18n.t('COMMON.SINCE', {
                        date: moment
                          .utc(date)
                          .local()
                          .format('DD.MM.YYYY HH:mm'),
                      })
                    )}
                  />
                </If>
              </Fragment>
            );
          }}
        />
      </GridView>
    );
  }
}

export default ClientsGrid;
