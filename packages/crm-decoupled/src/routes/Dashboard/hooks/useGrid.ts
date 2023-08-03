type UseGrid<ArrayContent> = {
  loading: boolean,
  content: ArrayContent,
  refetch: () => void,
};

/**
 * TODO find better type
 * type UseQuery<TData, TVariable> = (args?: OperationVariables) => Query<TData, TVariable>;
 * */
const useGrid = <ArrayContent>(useQuery: () => Record<string, any>, param: string): UseGrid<ArrayContent> => {
  const { data, loading, refetch } = useQuery();
  const content = data?.dashboard?.[param] || [];

  return {
    loading,
    refetch,
    content,
  };
};

export default useGrid;
