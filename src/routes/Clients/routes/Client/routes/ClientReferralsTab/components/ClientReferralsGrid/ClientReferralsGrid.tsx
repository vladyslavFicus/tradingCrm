import React from 'react';
import { useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { getBrand } from 'config';
import { Referral, Referral__BonusType__Enum as bonusTypes } from '__generated__/types';
import renderLabel from 'utils/renderLabel';
import { Table, Column } from 'components/Table';
import GridPlayerInfo from 'components/GridPlayerInfo';
import GridAcquisitionStatus from 'components/GridAcquisitionStatus';
import CountryLabelWithFlag from 'components/CountryLabelWithFlag';
import { bonusTypesLabels } from './constants';
import { useReferralsQuery } from './graphql/__generated__/ReferralsQuery';
import './ClientReferralsGrid.scss';

const ClientReferralsGrid = () => {
  const { id: uuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading } = useReferralsQuery({ variables: { uuid } });
  const content = data?.referrals || [];

  // ===== Renders ===== //
  const renderName = ({ referralInfo }: Referral) => (
    <GridPlayerInfo
      profile={{
        ...referralInfo,
        fullName: referralInfo.name,
        uuid: referralInfo.profileUuid,
      }}
    />
  );

  const renderCountry = ({ referralInfo: { languageCode, countryCode } }: Referral) => (
    <Choose>
      <When condition={!!countryCode}>
        <CountryLabelWithFlag code={countryCode} height="14" languageCode={languageCode} />
      </When>

      <Otherwise>
        &mdash;
      </Otherwise>
    </Choose>
  );

  const renderDate = (date: string) => (
    <>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {moment.utc(date).local().format('DD.MM.YYYY')}
      </div>

      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {moment.utc(date).local().format('HH:mm:ss')}
      </div>
    </>
  );

  const renderRegistrationDate = ({ referralInfo }: Referral) => {
    if (!referralInfo.registrationDate) {
      return <span>&mdash;</span>;
    }

    return renderDate(referralInfo.registrationDate);
  };

  const renderFtdDate = ({ ftdInfo }: Referral) => {
    if (!ftdInfo) {
      return <span>&mdash;</span>;
    }

    return renderDate(ftdInfo.date);
  };

  const renderRemunerationDate = ({ remuneration }: Referral) => {
    if (!remuneration) {
      return <span>&mdash;</span>;
    }

    return renderDate(remuneration.date);
  };

  const renderAmount = (currency: string, amount: number, normalizedAmount: number) => (
    <>
      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--bold">
        {Number(amount).toFixed(2)} {currency}
      </div>

      <div className="ClientReferralsGrid__col-text ClientReferralsGrid__col-text--small">
        {`(${getBrand().currencies.base} ${Number(normalizedAmount).toFixed(2)})`}
      </div>
    </>
  );

  const renderFtdAmount = ({ ftdInfo }: Referral) => {
    if (!ftdInfo) {
      return <span>&mdash;</span>;
    }

    const { currency, amount, normalizedAmount } = ftdInfo;

    return renderAmount(currency, amount, normalizedAmount);
  };

  const renderRemunerationAmount = ({ remuneration }: Referral) => {
    if (!remuneration) {
      return <span>&mdash;</span>;
    }

    const { currency, amount, normalizedAmount } = remuneration;

    return renderAmount(currency, amount, normalizedAmount);
  };

  const renderBonusType = ({ bonusType }: Referral) => (
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
      {I18n.t(renderLabel(bonusType, bonusTypesLabels))}
    </div>
  );

  const renderSalesStatus = ({ acquisition }: Referral) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'SALES'}
      acquisition="SALES"
      status={acquisition?.salesStatus || undefined}
      fullName={acquisition?.salesOperator?.fullName || ''}
      hierarchy={acquisition?.salesOperator?.hierarchy}
    />
  );

  const renderRetentionStatus = ({ acquisition }: Referral) => (
    <GridAcquisitionStatus
      active={acquisition?.acquisitionStatus === 'RETENTION'}
      acquisition="RETENTION"
      status={acquisition?.retentionStatus || undefined}
      fullName={acquisition?.retentionOperator?.fullName || ''}
      hierarchy={acquisition?.retentionOperator?.hierarchy}
    />
  );

  const customRowClass = ({ bonusType }: Referral) => bonusType === 'FTD' && 'ClientReferralsGrid__row--active';

  return (
    <div className="ClientReferralsGrid">
      <Table
        stickyFromTop={123}
        items={content}
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
