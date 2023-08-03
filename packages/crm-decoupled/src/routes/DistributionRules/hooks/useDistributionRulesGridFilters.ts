import { PARTNERS_SORT } from '../constants';
import { usePartnersQuery } from '../graphql/__generated__/PartnersQuery';

type Partner = {
  uuid: string,
  fullName: string | null,
  status: string,
};

type UseDistributionRulesGridFilters = {
  loading: boolean,
  partners: Array<Partner>,
};

const useDistributionRulesGridFilters = (): UseDistributionRulesGridFilters => {
  const { data, loading } = usePartnersQuery({ variables: { page: { sorts: PARTNERS_SORT } } });

  const partners = data?.partners?.content || [];

  return {
    loading,
    partners,
  };
};

export default useDistributionRulesGridFilters;
