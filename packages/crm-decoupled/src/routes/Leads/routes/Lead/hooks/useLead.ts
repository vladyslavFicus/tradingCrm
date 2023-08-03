import { useParams } from 'react-router-dom';
import { useLeadProfileQuery } from '../graphql/__generated__/LeadProfileQuery';

const useLead = () => {
  const uuid = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading, refetch } = useLeadProfileQuery({ variables: { uuid } });
  const lead = data?.lead;

  return {
    lead,
    loading,
    refetch,
  };
};

export default useLead;
