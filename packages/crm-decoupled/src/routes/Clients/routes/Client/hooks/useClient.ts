import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Trackify from '@hrzn/trackify';
import { getBrand } from 'config';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { useClientQuery } from '../graphql/__generated__/ClientQuery';

const useClient = () => {
  const playerUUID = useParams().id as string;

  const brand = getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowDepositConfig = permission.allows(permissions.USER_PROFILE.DEPOSIT_ENABLED_CONFIG);
  const allowReferrerStatistics = permission.allows(permissions.USER_PROFILE.REFERRER_STATISTICS);

  // ===== Requests ===== //
  const { data, loading, refetch } = useClientQuery({ variables: { playerUUID }, errorPolicy: 'all' });
  const profile = data?.profile;

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);

    Trackify.page({ eventAction: 'PROFILE_OPENED', eventLabel: playerUUID });

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
    };
  }, []);

  const isDisplayClientDepositSwitcher = allowDepositConfig && brand.profile.isDepositEnabled === false;

  return {
    allowReferrerStatistics,
    isDisplayClientDepositSwitcher,
    profile,
    loading,
    refetch,
  };
};

export default useClient;
