import { useParams } from 'react-router-dom';
import { Authority, Operator } from '__generated__/types';
import { isSales, userTypes } from 'constants/hierarchyTypes';
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
  const isSalesOperator = isSales(operator?.userType as userTypes);
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
