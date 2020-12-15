import React, { Component } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { getBrand } from 'config';
import { withRequests } from 'apollo';
import { lastActivityStatusesLabels, lastActivityStatusesColors } from 'constants/lastActivity';
import PropTypes from 'constants/propTypes';
import ProfileLastLogin from 'components/ProfileLastLogin';
import GridStatus from 'components/GridStatus';
import PlayerStatus from '../PlayerStatus';
import Balances from '../Balances';
import ReferrerStatisticsQuery from './graphql/ReferrerStatisticsQuery';
import './ProfileHeader.scss';

class ProfileHeader extends Component {
  static propTypes = {
    profile: PropTypes.profile,
    availableStatuses: PropTypes.array,
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
    availableStatuses: [],
  };

  render() {
    const {
      availableStatuses,
      profile,
      referrerStatisticsQuery: {
        data: referrerStatisticsData,
      },
    } = this.props;

    const {
      uuid,
      status,
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

    const {
      changedAt,
      changedBy,
      comment,
      reason,
      type: statusType,
    } = status || {};

    const {
      online,
      balance,
      lastActivity,
      lastSignInSessions,
    } = profileView || {};

    const { eventType, eventValue, location, date: lastActivityDate } = lastActivity || {};

    const lastActivityDateLocal = lastActivityDate && moment.utc(lastActivityDate).local();
    const lastActivityType = online ? 'ONLINE' : 'OFFLINE';

    const baseCurrency = getBrand().currencies.base;

    return (
      <div className="ProfileHeader">

        <div className="layout-quick-overview">
          <div className="header-block header-block_account">
            <PlayerStatus
              playerUUID={uuid}
              statusDate={changedAt}
              statusAuthor={changedBy}
              profileStatusComment={comment}
              status={statusType}
              reason={reason}
              availableStatuses={availableStatuses}
            />
          </div>
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
          <ProfileLastLogin lastIp={lastSignInSessions ? lastSignInSessions[lastSignInSessions.length - 1] : null} />
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('PROFILE.LAST_ACTIVITY.TITLE')}</div>
            <GridStatus
              colorClassName={lastActivityStatusesColors[lastActivityType]}
              statusLabel={I18n.t(lastActivityStatusesLabels[lastActivityType])}
              info={lastActivityDateLocal}
              infoLabel={date => date.fromNow()}
            />
            {lastActivityDateLocal && (
              <div className="header-block-small">
                {I18n.t('COMMON.ON')} {lastActivityDateLocal.format('DD.MM.YYYY')}
              </div>
            )}
            <If condition={location}>
              <div className="header-block-small">
                <div className="header-block-middle">{I18n.t('PROFILE.LAST_ACTIVITY.LOCATION')}: </div>
                {location}
              </div>
            </If>
            <If condition={eventType === 'MODALVIEW'}>
              <div className="header-block-small">
                <span className="header-block-middle">{I18n.t('PROFILE.LAST_ACTIVITY.MODAL')}: </span>
                {eventValue}
              </div>
            </If>
          </div>
          <div className="header-block header-block-inner">
            <div className="header-block-title">{I18n.t('CLIENT_PROFILE.CLIENT.REGISTERED.TITLE')}</div>
            <div className="header-block-middle">
              {moment.utc(registrationDate).local().fromNow()}
            </div>
            <div className="header-block-small">
              {I18n.t('COMMON.ON')} {moment.utc(registrationDate).local().format('DD.MM.YYYY')}
            </div>
          </div>
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
