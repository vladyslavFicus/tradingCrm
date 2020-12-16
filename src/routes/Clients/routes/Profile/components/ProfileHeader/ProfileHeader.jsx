import React, { Component } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import Balances from '../Balances';
import ReferrerStatisticsQuery from './graphql/ReferrerStatisticsQuery';
import './ProfileHeader.scss';

class ProfileHeader extends Component {
  static propTypes = {
    profile: PropTypes.profile,
    referrerStatisticsQuery: PropTypes.query({
      referrerStatistics: PropTypes.shape({
        referralsCount: PropTypes.number,
        ftdCount: PropTypes.number,
        remunerationTotalAmount: PropTypes.number,
      }),
    }).isRequired,
  };

  static defaultProps = {
    profile: {},
  };

  render() {
    const {
      profile,
      referrerStatisticsQuery: {
        data: referrerStatisticsData,
      },
    } = this.props;

    const {
      uuid,
      profileView,
      tradingAccounts,
      registrationDetails,
    } = profile;

    const {
      referralsCount,
      ftdCount,
      remunerationTotalAmount,
    } = get(referrerStatisticsData, 'referrerStatistics') || {};

    const registrationDate = registrationDetails?.registrationDate;

    const { balance } = profileView || {};

    const baseCurrency = getBrand().currencies.base;

    return (
      <div className="ProfileHeader">

        <div className="layout-quick-overview">
          {/* ClientBalance */}
          <div className="header-block header-block-inner header-block_balance" id="player-profile-balance-block">
            <If condition={uuid}>
              <Balances
                clientRegistrationDate={registrationDate}
                balances={{
                  amount: balance.amount,
                  credit: balance.credit,
                }}
                tradingAccounts={tradingAccounts && tradingAccounts.filter(account => account.accountType !== 'DEMO')}
                uuid={uuid}
              />
            </If>
          </div>

          {/* ClientRegistrationInfo */}
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}</div>
            <div className="header-block-middle">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
            </div>
          </div>

          {/* ClientReferrals */}
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.TITLE')}</div>
            <div className="header-block-middle">
              {referralsCount}
            </div>
            <div className="header-block-small">
              {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.FTD', { value: ftdCount })}
            </div>
            <div className="header-block-small">
              {I18n.t('CLIENT_PROFILE.CLIENT.REFERRALS.REMUNERATION', {
                value: remunerationTotalAmount,
                currency: baseCurrency,
              })}
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default withRequests({
  referrerStatisticsQuery: ReferrerStatisticsQuery,
})(ProfileHeader);
