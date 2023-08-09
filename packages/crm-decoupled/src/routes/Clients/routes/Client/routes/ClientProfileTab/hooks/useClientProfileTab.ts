import { useParams } from 'react-router-dom';
import { Config } from '@crm/common';
import { Profile } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import { useClientQuery } from '../../../graphql/__generated__/ClientQuery';

  type UseClientProfileTab = {
    profile: Profile,
    loading: boolean,
    hasAffiliate: boolean,
    showFtdToAffiliate: boolean,
    affiliateMinFtdDeposit?: number | null,
    minFtdDeposit?: number | null,
    allowsFtdToAffiliate: boolean,
  };

const useClientProfileTab = (): UseClientProfileTab => {
  const playerUUID = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading } = useClientQuery({ variables: { playerUUID }, errorPolicy: 'all' });
  const profile = data?.profile as Profile;

  const hasAffiliate = !!profile?.profileView?.affiliate;
  const showFtdToAffiliate = !!profile?.profileView?.affiliate?.ftd?.isVisible;
  const affiliateMinFtdDeposit = profile?.affiliate?.partner?.permission?.minFtdDeposit;

  const { affiliate: { restriction: { minFtdDeposit } } } = Config.getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowsFtdToAffiliate = permission.allowsAny([
    Config.permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE,
    Config.permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE,
  ]);

  return {
    profile,
    loading,
    hasAffiliate,
    showFtdToAffiliate,
    affiliateMinFtdDeposit,
    minFtdDeposit,
    allowsFtdToAffiliate,
  };
};

export default useClientProfileTab;
