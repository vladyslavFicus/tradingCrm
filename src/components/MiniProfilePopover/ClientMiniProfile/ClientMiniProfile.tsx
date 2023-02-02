import React, { useMemo } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { getBrand } from 'config';
import { parseErrors } from 'apollo';
import permissions from 'config/permissions';
import renderLabel from 'utils/renderLabel';
import ShortLoader from 'components/ShortLoader';
import { usePermission } from 'providers/PermissionsProvider';
import { statuses } from 'constants/user';
import {
  MiniProfile,
  MiniProfileHeader,
  MiniProfileContent,
  MiniProfileContentItem,
} from '../components';
import { userStatusNames } from '../constants';
import { Statuses } from '../types';
import { useClientMiniProfileQuery } from './graphql/__generated__/ClientMiniProfileQuery';
import './ClientMiniProfile.scss';

type Props = {
  playerUUID: string,
};

const ClientMiniProfile = (props: Props) => {
  const { playerUUID } = props;

  const permission = usePermission();

  const currency = getBrand().currencies.base;

  const { data, error, loading } = useClientMiniProfileQuery({
    variables: { playerUUID },
  });

  const {
    registrationDetails,
    profileView,
    kyc,
    status,
    languageCode,
    firstName,
    lastName,
    uuid,
    age,
  } = data?.profile || {};
  const { lastSignInSessions, paymentDetails } = profileView || {};

  const lastLogin = useMemo(() => (
    lastSignInSessions?.length
      ? lastSignInSessions[lastSignInSessions.length - 1]?.startedAt
      : null),
  [lastSignInSessions]);

  if (loading) {
    return (
      <div className="ClientMiniProfile__loader">
        <ShortLoader />
      </div>
    );
  }

  if (error && parseErrors(error).error === 'error.profile.access.hierarchy.not-subordinate') {
    return (
      <MiniProfile className="ClientMiniProfile">
        <div className="ClientMiniProfile ClientMiniProfile__error">
          <div className="ClientMiniProfile__error-message">
            {I18n.t('MINI_PROFILE.NO_ACCESS.CLIENT')}
          </div>
        </div>
      </MiniProfile>
    );
  }

  return (
    <MiniProfile className="ClientMiniProfile" status={status?.type?.toLowerCase() as Statuses}>
      <MiniProfileHeader
        label={renderLabel(status?.type || '', userStatusNames)}
        type={I18n.t('MINI_PROFILE.CLIENT')}
        title={`${firstName} ${lastName}`}
        age={age}
        KYCStatus={kyc?.status}
        uuid={uuid}
        uuidDesctiption={languageCode}
      />

      <If condition={status?.type === statuses.BLOCKED || status?.type === 'SUSPENDED'}>
        <div className="ClientMiniProfile__reason">
          <div className="ClientMiniProfile__reason-label">{I18n.t('MINI_PROFILE.STATUS_REASON')}</div>
          <div className="ClientMiniProfile__reason-content">{I18n.t(status?.reason || '')}</div>
        </div>
      </If>

      <MiniProfileContent>
        <If condition={permission.allows(permissions.USER_PROFILE.BALANCE)}>
          <MiniProfileContentItem
            label={I18n.t('MINI_PROFILE.BALANCE')}
            description={`${I18n.toCurrency(profileView?.balance?.amount || 0, { unit: '' })} ${currency}`}
          />
        </If>

        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.LAST_LOGIN')}
          description={lastLogin
            ? moment.utc(lastLogin).local().fromNow()
            : I18n.t('COMMON.UNAVAILABLE')
          }
        />

        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.DEPOSITED')}
          description={paymentDetails?.lastDepositTime
            ? moment.utc(paymentDetails.lastDepositTime).local().fromNow()
            : I18n.t('COMMON.NEVER')}
        />

        <MiniProfileContentItem
          label={I18n.t('MINI_PROFILE.REGISTERED')}
          description={moment.utc(registrationDetails?.registrationDate || '').local().fromNow()}
        />
      </MiniProfileContent>
    </MiniProfile>
  );
};

export default React.memo(ClientMiniProfile);
