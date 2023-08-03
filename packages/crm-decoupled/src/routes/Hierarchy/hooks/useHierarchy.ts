import { useTreeTopQuery } from '../graphql/__generated__/TreeTopQuery';

const useHierarchy = () => {
  // ===== Requests ===== //
  const { data, loading } = useTreeTopQuery();

  const branches = data?.treeTop || [];

  return {
    branches,
    loading,
  };
};

export default useHierarchy;
