import React from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { useClientReferrerStatisticsQuery } from './graphql/__generated__/ClientReferrerStatisticsQuery';
import './ClientReferrals.scss';

type Props = {
  clientUuid: string,
};

const ClientReferrals = (props: Props) => {
  const { clientUuid: uuid } = props;

  const baseCurrency = getBrand().currencies.base;

  // ===== Requests ===== //
  const { data, loading } = useClientReferrerStatisticsQuery({ variables: { uuid } });
  const { ftdCount, referralsCount, remunerationTotalAmount } = data?.referrerStatistics || {};

  return (
    <div className="ClientReferrals">
      <div className="ClientReferrals__title">{I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.TITLE')}</div>

      <If condition={!loading}>
        <div className="ClientReferrals__text-primary">{referralsCount}</div>

        <div className="ClientReferrals__text-secondary">
          {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.FTD', { value: ftdCount })}
        </div>

        <div className="ClientReferrals__text-secondary">
          {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.REMUNERATION', {
            value: I18n.toCurrency(remunerationTotalAmount || 0, { unit: '' }),
            currency: baseCurrency,
          })}
        </div>
      </If>
    </div>
  );
};

export default React.memo(ClientReferrals);
