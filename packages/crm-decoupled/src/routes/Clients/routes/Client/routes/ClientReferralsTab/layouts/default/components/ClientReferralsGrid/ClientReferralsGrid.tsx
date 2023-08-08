import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { Config, Utils } from '@crm/common';
import { Referral, Referral__BonusType__Enum as bonusTypes } from '__generated__/types';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { Hierarchy } from 'components/GridAcquisitionStatus/hooks/useGridAcquisitionStatus';
import { bonusTypesLabels } from 'routes/Clients/routes/Client/routes/ClientReferralsTab/constants';
import useClientReferralsGrid
  from 'routes/Clients/routes/Client/routes/ClientReferralsTab/hooks/useClientReferralsGrid';
import './ClientReferralsGrid.scss';

const ClientReferralsGrid = () => {
  const {
    data,
    loading,
    customRowClass,
  } = useClientReferralsGrid();

  // ===== Renders ===== //
  const renderName = useCallback(({ referralInfo }: Referral) => (
    <GridPlayerInfo
      profile={{
        ...referralInfo,
        fullName: referralInfo.name,
        uuid: referralInfo.profileUuid,
      }}
    />
  ), []);

  const renderCountry = useCallback(({ referralInfo: { languageCode, countryCode } }: Referral) => (
    <Choose>
      <When condition={!!countryCode}>
        <CountryLabelWithFlag code={countryCode} height="14" languageCode={languageCode} />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  ), []);

  const renderDate = useCallback((date: string) => (
    <>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>

      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {moment.utc(date).local().format('HH:mm:ss')}
      </div>
    </>
  ), []);

  const renderRegistrationDate = useCallback(({ referralInfo }: Referral) => {
    if (!referralInfo.registrationDate) {
      return <>&mdash;</>;
    }

    return renderDate(referralInfo.registrationDate);
  }, []);

  const renderFtdDate = useCallback(({ ftdInfo }: Referral) => {
    if (!ftdInfo) {
      return <>&mdash;</>;
    }

    return renderDate(ftdInfo.date);
  }, []);

  const renderRemunerationDate = useCallback(({ remuneration }: Referral) => {
    if (!remuneration) {
      return <>&mdash;</>;
    }

    return renderDate(remuneration.date);
  }, []);

  const renderAmount = useCallback((currency: string, amount: number, normalizedAmount: number) => (
    <>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {Number(amount).toFixed(2)} {currency}
      </div>

      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {`(${Config.getBrand().currencies.base} ${Number(normalizedAmount).toFixed(2)})`}
      </div>
    </>
  ), []);

  const renderFtdAmount = useCallback(({ ftdInfo }: Referral) => {
    if (!ftdInfo) {
      return <>&mdash;</>;
    }

    const { currency, amount, normalizedAmount } = ftdInfo;

    return renderAmount(currency, amount, normalizedAmount);
  }, []);

  const renderRemunerationAmount = useCallback(({ remuneration }: Referral) => {
    if (!remuneration) {
      return <>&mdash;</>;
    }

    const { currency, amount, normalizedAmount } = remuneration;

    return renderAmount(currency, amount, normalizedAmount);
  }, []);

  const renderBonusType = useCallback(({ bonusType }: Referral) => (
    <div className={classNames(
      'ClientReferralsGrid__col-text',
      'ClientReferralsGrid__col-text--bold',
      'ClientReferralsGrid__col-text--upper',
      'ClientReferralsGrid__type', {
        'ClientReferralsGrid__type--ftd': bonusType === bonusTypes.FTD,
        'ClientReferralsGrid__type--registration': bonusType === bonusTypes.REGISTRATION,
      },
    )}
    >
      {I18n.t(Utils.renderLabel(bonusType, bonusTypesLabels))}
    </div>
  ), []);

  const renderSalesStatus = useCallback(({ acquisition }: Referral) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus || undefined}
      fullName={acquisition?.salesOperator?.fullName || ''}
      hierarchy={acquisition?.salesOperator?.hierarchy as Hierarchy}
    />
  ), []);

  const renderRetentionStatus = useCallback(({ acquisition }: Referral) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus || undefined}
      fullName={acquisition?.retentionOperator?.fullName || ''}
      hierarchy={acquisition?.retentionOperator?.hierarchy as Hierarchy}
    />
  ), []);

  return (
    <div className="ClientReferralsGrid">
      <Table
        stickyFromTop={123}
        items={data?.referrals || []}
        loading={loading}
        customClassNameRow={customRowClass}
      >
        <Column
          header={I18n.t('REFERRALS.GRID.NAME')}
          render={renderName}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.COUNTRY')}
          render={renderCountry}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.BONUS_TYPE')}
          render={renderBonusType}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.REGISTRATION')}
          render={renderRegistrationDate}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.FTD_AMOUNT')}
          render={renderFtdAmount}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.FTD_DATE')}
          render={renderFtdDate}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.REMUNERATION')}
          render={renderRemunerationAmount}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.REMUNERATION_DATE')}
          render={renderRemunerationDate}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.SALES')}
          render={renderSalesStatus}
        />

        <Column
          header={I18n.t('REFERRALS.GRID.RETENTION')}
          render={renderRetentionStatus}
        />
      </Table>
    </div>
  );
};

export default React.memo(ClientReferralsGrid);
