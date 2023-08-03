import { useCallback } from 'react';
import { OperationVariables } from '@apollo/client';
import { DateRange, UseChart } from '../types';
import { chartInitialQueryParams } from '../utils';

/**
 * TODO find better type
 * type UseQuery<TData, TVariable> = (args?: OperationVariables) => Query<TData, TVariable>;
 * */
const useChart = (useQuery: (args: OperationVariables) => Record<string, any>, param: string): UseChart => {
  // Initial variables
  const variables = chartInitialQueryParams();

  // ===== Requests ===== //
  const {
    loading,
    refetch,
    data,
    error,
  } = useQuery({ variables, fetchPolicy: 'cache-and-network' });

  const chartList = data?.dashboard?.[param]?.items || [];
  const summaryList = data?.dashboard?.[param]?.summary || [];

  // ===== Handlers ===== //
  const handleSelectChange = useCallback(
    (range: DateRange) => refetch({ ...variables, ...range }),
    [variables, refetch],
  );

  return {
    isChartLoading: loading,
    isChartError: !!error,
    chartList,
    summaryList,
    handleSelectChange,
  };
};

export default useChart;
