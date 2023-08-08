import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Trackify from '@hrzn/trackify';
import { Config, Utils } from '@crm/common';
import { usePermission } from 'providers/PermissionsProvider';
import { useClientQuery } from '../graphql/__generated__/ClientQuery';

const useClient = () => {
  const playerUUID = useParams().id as string;

  const brand = Config.getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowDepositConfig = permission.allows(Config.permissions.USER_PROFILE.DEPOSIT_ENABLED_CONFIG);
  const allowReferrerStatistics = permission.allows(Config.permissions.USER_PROFILE.REFERRER_STATISTICS);

  // ===== Requests ===== //
  const { data, loading, refetch } = useClientQuery({ variables: { playerUUID }, errorPolicy: 'all' });
  const profile = data?.profile;

  // ===== Effects ===== //
  useEffect(() => {
    Utils.EventEmitter.on(Utils.CLIENT_RELOAD, refetch);

    Trackify.page({ eventAction: 'PROFILE_OPENED', eventLabel: playerUUID });

    return () => {
      Utils.EventEmitter.off(Utils.CLIENT_RELOAD, refetch);
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
