import { useParams } from 'react-router-dom';
import { Partner as PartnerType } from '__generated__/types';
import { usePartnerQuery } from '../graphql/__generated__/PartnerQuery';

type Partner = {
  partner: PartnerType,
  isNotPartner: boolean,
  loading: boolean,
  refetch: () => void,
};

const usePartner = (): Partner => {
  const uuid = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading, refetch } = usePartnerQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const partner = data?.partner as PartnerType;
  const isNotPartner = !partner;

  return {
    partner,
    isNotPartner,
    loading,
    refetch,
  };
};

export default usePartner;
