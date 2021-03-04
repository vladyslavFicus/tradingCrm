import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import ClientReferrerStatisticsQuery from './graphql/ClientReferrerStatisticsQuery';
import './ClientReferrals.scss';

class ClientReferrals extends PureComponent {
  static propTypes = {
    clientReferralStatisticQuery: PropTypes.query({
      referrerStatistics: PropTypes.shape({
        referralsCount: PropTypes.number,
        ftdCount: PropTypes.number,
        remunerationTotalAmount: PropTypes.number,
      }),
    }).isRequired,
  }

  render() {
    const { clientReferralStatisticQuery } = this.props;

    const {
      ftdCount,
      referralsCount,
      remunerationTotalAmount,
    } = clientReferralStatisticQuery.data?.referrerStatistics || {};

    const baseCurrency = getBrand().currencies.base;

    return (
      <div className="ClientReferrals">
        <div className="ClientReferrals__title">{I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.TITLE')}</div>

        <If condition={!clientReferralStatisticQuery.loading}>
          <div className="ClientReferrals__text-primary">{referralsCount}</div>

          <div className="ClientReferrals__text-secondary">
            {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.FTD', { value: ftdCount })}
          </div>

          <div className="ClientReferrals__text-secondary">
            {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.REMUNERATION', {
              value: remunerationTotalAmount,
              currency: baseCurrency,
            })}
          </div>
        </If>
      </div>
    );
  }
}

export default withRequests({
  clientReferralStatisticQuery: ClientReferrerStatisticsQuery,
})(ClientReferrals);
