import { useParams } from 'react-router-dom';
import { useCallback } from 'react';
import { Referral } from '__generated__/types';
import { ReferralsQuery, useReferralsQuery } from '../graphql/__generated__/ReferralsQuery';

type UseClientReferralsGrid = {
  data?: ReferralsQuery,
  loading: boolean,
  customRowClass: ({ bonusType }: Referral) => void,
};

const useClientReferralsGrid = (): UseClientReferralsGrid => {
  const uuid = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading } = useReferralsQuery({ variables: { uuid } });

  const customRowClass = useCallback(
    ({ bonusType }: Referral) => bonusType === 'FTD' && 'ClientReferralsGrid__row--active', [],
  );

  return {
    data,
    loading,
    customRowClass,
  };
};

export default useClientReferralsGrid;
