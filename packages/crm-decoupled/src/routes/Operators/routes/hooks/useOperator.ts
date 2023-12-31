import { useParams } from 'react-router-dom';
import { Constants } from '@crm/common';
import { Authority, Operator } from '__generated__/types';
import { useOperatorQuery } from '../graphql/__generated__/OperatorQuery';

type UseOperator = {
  loading: boolean,
  isSalesOperator: boolean,
  operator: Operator,
  authorities: Array<Authority>,
  refetch: () => void,
};

const useOperator = (): UseOperator => {
  const uuid = useParams().id as string;

  // ===== Requests ===== //
  const { data, loading, refetch } = useOperatorQuery({ variables: { uuid }, fetchPolicy: 'network-only' });

  const operator = data?.operator as Operator;
  const isSalesOperator = Constants.isSales(operator?.userType as Constants.userTypes);
  const authorities = operator?.authorities || [];

  return {
    loading,
    isSalesOperator,
    operator,
    authorities,
    refetch,
  };
};

export default useOperator;
