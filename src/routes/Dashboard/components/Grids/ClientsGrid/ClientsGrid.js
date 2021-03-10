import React, { PureComponent, Fragment } from 'react';
import { get } from 'lodash';
import I18n from 'i18n-js';
import moment from 'moment';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import {
  statusColorNames as userStatusColorNames,
  statusesLabels as userStatusesLabels,
} from 'constants/user';
import { salesStatuses, salesStatusesColor } from 'constants/salesStatuses';
import { retentionStatuses, retentionStatusesColor } from 'constants/retentionStatuses';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import GridStatusDeskTeam from 'components/GridStatusDeskTeam';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import GridEmptyValue from 'components/GridEmptyValue';
import GridStatus from 'components/GridStatus';
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

    return (
      <div className="DashboardClientsGrid">
        <Table
          items={profiles}
          loading={loading}
        >
          <Column
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
            render={data => (
              <GridPlayerInfo profile={data} />
            )}
          />
          <Column
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
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
            render={(data) => {
              const currency = getBrand().currencies.base;
              const balance = get(data, 'balance') || {};

              return (
                <Choose>
                  <When condition={balance.amount}>
                    <div className="header-block-middle">
                      {currency} {Number(balance.amount).toFixed(2)}
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
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
            render={(data) => {
              const paymentDetails = get(data, 'paymentDetails') || {};
              return (
                <Choose>
                  <When condition={paymentDetails.lastDepositTime}>
                    <div className="font-weight-700">{paymentDetails.depositsCount}</div>
                    <div className="font-size-11">
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
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE')}
            render={(data) => {
              const { uuid, partner } = get(data, 'affiliate') || {};

              return (
                <Choose>
                  <When condition={uuid}>
                    <If condition={partner}>
                      <div className="header-block-middle">{partner.fullName}</div>
                    </If>
                    <Uuid className="header-block-small" uuid={uuid} />
                  </When>
                  <Otherwise>
                    <GridEmptyValue />
                  </Otherwise>
                </Choose>
              );
            }}
          />
          <Column
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
            render={(data) => {
              const {
                salesStatus,
                salesOperator,
                acquisitionStatus,
              } = get(data, 'acquisition') || {};
              const colorClassName = salesStatusesColor[salesStatus];

              return (
                <Choose>
                  <When condition={salesStatus}>
                    <GridStatus
                      wrapperClassName={acquisitionStatus === 'SALES' ? `border-${colorClassName}` : ''}
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
          <Column
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
            render={(data) => {
              const {
                retentionStatus,
                retentionOperator,
                acquisitionStatus,
              } = get(data, 'acquisition') || {};
              const colorClassName = retentionStatusesColor[retentionStatus];

              return (
                <Choose>
                  <When condition={retentionStatus}>
                    <GridStatus
                      wrapperClassName={acquisitionStatus === 'RETENTION' ? `border-${colorClassName}` : ''}
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
          <Column
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
            render={({ registrationDetails: { registrationDate } }) => (
              <Fragment>
                <div className="font-weight-700">{moment.utc(registrationDate).local().format('DD.MM.YYYY')}</div>
                <div className="font-size-11">
                  {moment.utc(registrationDate).local().format('HH:mm:ss')}
                </div>
              </Fragment>
            )}
          />
          <Column
            header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
            render={({ status: { type, changedAt } }) => (
              <GridStatus
                colorClassName={userStatusColorNames[type]}
                statusLabel={I18n.t(renderLabel(type, userStatusesLabels))}
                info={changedAt}
                infoLabel={date => I18n.t('COMMON.SINCE', {
                  date: moment.utc(date).local().format('DD.MM.YYYY HH:mm'),
                })}
              />
            )}
          />
        </Table>
      </div>
    );
  }
}

export default withRequests({
  clientsQuery: ClientsQuery,
})(ClientsGrid);
