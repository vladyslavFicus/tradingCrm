import { useParams } from 'react-router-dom';
import { getBrand } from 'config';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Profile } from '__generated__/types';
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

  const { affiliate: { restriction: { minFtdDeposit } } } = getBrand();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowsFtdToAffiliate = permission.allowsAny([
    permissions.PAYMENT.DISABLE_SHOW_FTD_TO_AFFILIATE,
    permissions.PAYMENT.ENABlE_SHOW_FTD_TO_AFFILIATE,
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
