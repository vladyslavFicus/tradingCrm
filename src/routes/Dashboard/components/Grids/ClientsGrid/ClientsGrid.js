import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { getBrand, getBackofficeBrand } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import {
  statuses,
  statusesLabels,
} from 'constants/user';
import { AdjustableTable, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import GridEmptyValue from 'components/GridEmptyValue';
import renderLabel from 'utils/renderLabel';
import ClientsQuery from './graphql/ClientsQuery';
import './ClientsGrid.scss';

class ClientsGrid extends PureComponent {
  static propTypes = {
    clientsQuery: PropTypes.query({
      profiles: PropTypes.pageable(PropTypes.profile),
    }).isRequired,
  };

  handleRowClick = ({ uuid }) => {
    window.open(`/clients/${uuid}/profile`, '_blank');
  };

  render() {
    const {
      clientsQuery,
      clientsQuery: { loading },
    } = this.props;

    const profiles = get(clientsQuery, 'data.profiles.content') || [];
    const columnsOrder = getBackofficeBrand()?.tables?.registrations?.columnsOrder;
    return (
      <div className="DashboardClientsGrid">
        <AdjustableTable
          columnsOrder={columnsOrder}
          items={profiles}
          loading={loading}
        >
          <Column
            name="client"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
            render={data => (
              <GridPlayerInfo profile={data} />
            )}
          />
          <Column
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
                  <GridEmptyValue />
                </Otherwise>
              </Choose>
            )}
          />
          <Column
            name="balance"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
            render={(data) => {
              const currency = getBrand().currencies.base;
              const balance = get(data, 'balance') || {};

              return (
                <Choose>
                  <When condition={balance.amount}>
                    <div className="DashboardClientsGrid__text-primary">
                      {currency} {I18n.toCurrency(balance.amount, { unit: '' })}
                    </div>
                  </When>
                  <Otherwise>
                    <GridEmptyValue />
                  </Otherwise>
                </Choose>
              );
            }}
          />
          <Column
            name="deposits"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
            render={(data) => {
              const paymentDetails = get(data, 'paymentDetails') || {};
              return (
                <Choose>
                  <When condition={paymentDetails.lastDepositTime}>
                    <div className="DashboardClientsGrid__text-primary">{paymentDetails.depositsCount}</div>
                    <div className="DashboardClientsGrid__text-secondary">
                      {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
                      {' '}
                      {moment(paymentDetails.lastDepositTime).format('DD.MM.YYYY')}
                    </div>
                  </When>
                  <Otherwise>
                    <GridEmptyValue />
                  </Otherwise>
                </Choose>
              );
            }}
          />
          <Column
            name="affiliate"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE')}
            render={(data) => {
              const { uuid, partner } = get(data, 'affiliate') || {};

              return (
                <Choose>
                  <When condition={uuid}>
                    <If condition={partner}>
                      <div className="DashboardClientsGrid__text-primary">{partner.fullName}</div>
                    </If>
                    <Uuid className="DashboardClientsGrid__text-secondary" uuid={uuid} />
                  </When>
                  <Otherwise>
                    <GridEmptyValue />
                  </Otherwise>
                </Choose>
              );
            }}
          />
          <Column
            name="sales"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
            render={({ acquisition }) => (
              <GridAcquisitionStatus
                active={acquisition?.acquisitionStatus === 'SALES'}
                acquisition="SALES"
                status={acquisition?.salesStatus}
                fullName={acquisition?.salesOperator?.fullName}
                hierarchy={acquisition?.salesOperator?.hierarchy}
              />
            )}
          />
          <Column
            name="retention"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
            render={({ acquisition }) => (
              <GridAcquisitionStatus
                active={acquisition?.acquisitionStatus === 'RETENTION'}
                acquisition="RETENTION"
                status={acquisition?.retentionStatus}
                fullName={acquisition?.retentionOperator?.fullName}
                hierarchy={acquisition?.retentionOperator?.hierarchy}
              />
            )}
          />
          <Column
            name="registrationDate"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
            render={({ registrationDetails: { registrationDate } }) => (
              <Fragment>
                <div className="DashboardClientsGrid__text-primary">
                  {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
                </div>
                <div className="DashboardClientsGrid__text-secondary">
                  {moment.utc(registrationDate).local().format('HH:mm:ss')}
                </div>
              </Fragment>
            )}
          />
          <Column
            name="status"
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
            render={({ status: { type, changedAt } }) => (
              <>
                <div
                  className={classNames(
                    'DashboardClientsGrid__text-primary',
                    'DashboardClientsGrid__text-primary--uppercase',
                    'DashboardClientsGrid__status',
                    {
                      'DashboardClientsGrid__status--verified': type === statuses.VERIFIED,
                      'DashboardClientsGrid__status--not-verified': type === statuses.NOT_VERIFIED,
                      'DashboardClientsGrid__status--blocked': type === statuses.BLOCKED,
                    },
                  )}
                >
                  {I18n.t(renderLabel(type, statusesLabels))}
                </div>

                <div className="DashboardClientsGrid__text-secondary">
                  {I18n.t('COMMON.SINCE', {
                    date: moment.utc(changedAt).local().format('DD.MM.YYYY HH:mm'),
                  })}
                </div>
              </>
            )}
          />
        </AdjustableTable>
      </div>
    );
  }
}

export default withRequests({
  clientsQuery: ClientsQuery,
})(ClientsGrid);
