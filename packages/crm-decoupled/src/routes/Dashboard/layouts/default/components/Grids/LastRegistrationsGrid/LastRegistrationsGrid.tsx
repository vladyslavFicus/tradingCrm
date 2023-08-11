import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Config, Utils, Constants } from '@crm/common';
import { Table, Column } from 'components/Table';
import Uuid from 'components/Uuid';
import GridPlayerInfo from 'components/GridPlayerInfo';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import { Hierarchy } from 'components/GridAcquisitionStatus/hooks/useGridAcquisitionStatus';
import GridEmptyValue from 'components/GridEmptyValue';
import { Grids } from 'routes/Dashboard/types';
import useGrid from 'routes/Dashboard/hooks/useGrid';
import {
  LastRegistrationsQuery,
  useLastRegistrationsQuery,
} from 'routes/Dashboard/graphql/__generated__/LastRegistrationsQuery';
import './LastRegistrationsGrid.scss';

export type LastRegistration = ExtractApolloTypeFromArray<LastRegistrationsQuery['dashboard']['lastRegistration']>;

const LastRegistrationsGrid = () => {
  const { content, loading } = useGrid<LastRegistration>(useLastRegistrationsQuery, Grids.lastRegistration);

  // ===== Renders ===== //
  const renderClient = (rowCell: LastRegistration) => (
    <GridPlayerInfo profile={rowCell} />
  );

  const renderCountry = useCallback(({ address, languageCode }: LastRegistration) => {
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
  }, []);

  const renderBalance = useCallback(({ balance }: LastRegistration) => {
    const currency = Config.getBrand().currencies?.base;
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
  }, []);

  const renderDeposits = useCallback(({ paymentDetails }: LastRegistration) => {
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
  }, []);

  const renderAffiliate = useCallback(({ affiliate }: LastRegistration) => {
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
  }, []);

  const renderSales = useCallback(({ acquisition }: LastRegistration) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus || ''}
      fullName={acquisition?.salesOperator?.fullName || ''}
      hierarchy={acquisition?.salesOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRetention = useCallback(({ acquisition }: LastRegistration) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus || ''}
      fullName={acquisition?.retentionOperator?.fullName || ''}
      hierarchy={acquisition?.retentionOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRegistrationDate = useCallback(({ registrationDetails }: LastRegistration) => {
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
  }, []);

  const renderStatus = useCallback(({ status }: LastRegistration) => {
    const { type, changedAt } = status || {};

    return (
      <>
        <div
          className={classNames(
            'LastRegistrationsGrid__text-primary',
            'LastRegistrationsGrid__text-primary--uppercase',
            'LastRegistrationsGrid__status',
            {
              'LastRegistrationsGrid__status--verified': type === Constants.User.statuses.VERIFIED,
              'LastRegistrationsGrid__status--not-verified': type === Constants.User.statuses.NOT_VERIFIED,
              'LastRegistrationsGrid__status--blocked': type === Constants.User.statuses.BLOCKED,
            },
          )}
        >
          {I18n.t(Utils.renderLabel(type || '', Constants.User.statusesLabels))}
        </div>

        <div className="LastRegistrationsGrid__text-secondary">
          {I18n.t('COMMON.SINCE', {
            date: moment.utc(changedAt || '').local().format('DD.MM.YYYY HH:mm'),
          })}
        </div>
      </>
    );
  }, []);

  return (
    <div className="LastRegistrationsGrid">
      <div className="LastRegistrationsGrid__title">
        {I18n.t('DASHBOARD.LATEST_REGISTRATIONS')}
      </div>

      <Table
        items={content}
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
