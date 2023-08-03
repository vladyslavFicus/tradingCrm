import { getBrand } from 'config';
import { useClientReferrerStatisticsQuery } from '../graphql/__generated__/ClientReferrerStatisticsQuery';

type Props = {
  clientUuid: string,
};

type UseClientReferrals = {
  loading: boolean,
  ftdCount?: number | null,
  referralsCount?: number | null,
  baseCurrency: Record<string, string>,
  remunerationTotalAmount?: number | null,
};

const useClientReferrals = (props: Props): UseClientReferrals => {
  const { clientUuid: uuid } = props;

  const baseCurrency = getBrand().currencies.base;

  // ===== Requests ===== //
  const { data, loading } = useClientReferrerStatisticsQuery({ variables: { uuid } });
  const { ftdCount, referralsCount, remunerationTotalAmount } = data?.referrerStatistics || {};

  return {
    loading,
    ftdCount,
    referralsCount,
    baseCurrency,
    remunerationTotalAmount,
  };
};

export default useClientReferrals;
