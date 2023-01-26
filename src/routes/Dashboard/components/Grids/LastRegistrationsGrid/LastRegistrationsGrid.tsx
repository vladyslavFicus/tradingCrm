import React from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { getBrand } from 'config';
import { statuses, statusesLabels } from 'constants/user';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import GridEmptyValue from 'components/GridEmptyValue';
import renderLabel from 'utils/renderLabel';
import { useLastRegistrationsQuery, LastRegistrationsQuery } from './graphql/__generated__/LastRegistrationsQuery';
import './LastRegistrationsGrid.scss';

type LastRegistration = ExtractApolloTypeFromArray<LastRegistrationsQuery['profiles']['content']>;

const LastRegistrationsGrid = () => {
  const { data, loading } = useLastRegistrationsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 10,
        },
      },
    },
  });

  const renderClient = (rowCell: LastRegistration) => (
    <GridPlayerInfo profile={rowCell} />
  );

  const renderCountry = ({ address, languageCode }: LastRegistration) => {
    const { countryCode } = address || {};

    return (
      <Choose>
        <When condition={!!countryCode}>
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
    );
  };

  const renderBalance = ({ balance }: LastRegistration) => {
    const currency = getBrand().currencies?.base;
    const amount = Number(balance?.amount) || 0;

    return (
      <Choose>
        <When condition={!!balance?.amount}>
          <div className="LastRegistrationsGrid__text-primary">
            {currency} {I18n.toCurrency(amount, { unit: '' })}
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  };

  const renderDeposits = ({ paymentDetails }: LastRegistration) => {
    const { depositsCount, lastDepositTime } = paymentDetails || {};

    return (
      <Choose>
        <When condition={!!lastDepositTime}>
          <div className="LastRegistrationsGrid__text-primary">{depositsCount}</div>
          <div className="LastRegistrationsGrid__text-secondary">
            {I18n.t('CLIENT_PROFILE.CLIENT.BALANCES.LAST')}
            {' '}
            {moment(lastDepositTime || '').format('DD.MM.YYYY')}
          </div>
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  };

  const renderAffiliate = ({ affiliate }: LastRegistration) => {
    const { uuid, partner } = affiliate || {};

    return (
      <Choose>
        <When condition={!!uuid}>
          <If condition={!!partner}>
            <div className="LastRegistrationsGrid__text-primary">{partner?.fullName}</div>
          </If>

          <Uuid className="LastRegistrationsGrid__text-secondary" uuid={uuid || ''} />
        </When>

        <Otherwise>
          <GridEmptyValue />
        </Otherwise>
      </Choose>
    );
  };

  const renderSales = ({ acquisition }: LastRegistration) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus || ''}
      fullName={acquisition?.salesOperator?.fullName || ''}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  const renderRetention = ({ acquisition }: LastRegistration) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus || ''}
      fullName={acquisition?.retentionOperator?.fullName || ''}
      hierarchy={acquisition?.retentionOperator?.hierarchy}
    />
  );

  const renderRegistrationDate = ({ registrationDetails }: LastRegistration) => {
    const { registrationDate } = registrationDetails || {};

    return (
      <>
        <div className="LastRegistrationsGrid__text-primary">
          {moment.utc(registrationDate || '').local().format('DD.MM.YYYY')}
        </div>

        <div className="LastRegistrationsGrid__text-secondary">
          {moment.utc(registrationDate || '').local().format('HH:mm:ss')}
        </div>
      </>
    );
  };

  const renderStatus = ({ status }: LastRegistration) => {
    const { type, changedAt } = status || {};

    return (
      <>
        <div
          className={classNames(
            'LastRegistrationsGrid__text-primary',
            'LastRegistrationsGrid__text-primary--uppercase',
            'LastRegistrationsGrid__status',
            {
              'LastRegistrationsGrid__status--verified': type === statuses.VERIFIED,
              'LastRegistrationsGrid__status--not-verified': type === statuses.NOT_VERIFIED,
              'LastRegistrationsGrid__status--blocked': type === statuses.BLOCKED,
            },
          )}
        >
          {I18n.t(renderLabel(type || '', statusesLabels))}
        </div>

        <div className="LastRegistrationsGrid__text-secondary">
          {I18n.t('COMMON.SINCE', {
            date: moment.utc(changedAt || '').local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </>
    );
  };

  return (
    <div className="LastRegistrationsGrid">
      <div className="LastRegistrationsGrid__title">
        {I18n.t('DASHBOARD.LATEST_REGISTRATIONS')}
      </div>

      <Table
        items={data?.profiles?.content || []}
        loading={loading}
      >
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.CLIENT')}
          render={renderClient}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.COUNTRY')}
          render={renderCountry}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.BALANCE')}
          render={renderBalance}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.DEPOSITS')}
          render={renderDeposits}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.AFFILIATE')}
          render={renderAffiliate}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.SALES')}
          render={renderSales}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.RETENTION')}
          render={renderRetention}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.REGISTRATION')}
          render={renderRegistrationDate}
        />
        <Column
          header={I18n.t('CLIENTS.LIST.GRID_HEADER.STATUS')}
          render={renderStatus}
        />
      </Table>
    </div>
  );
};

export default React.memo(LastRegistrationsGrid);
