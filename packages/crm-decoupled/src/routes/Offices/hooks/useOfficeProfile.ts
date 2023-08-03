import { useParams } from 'react-router-dom';
import { useBranchInfoQuery } from '../graphql/__generated__/BranchInfoQuery';

const useOfficeProfile = () => {
  const branchId = useParams().id as string;

  const { data, loading } = useBranchInfoQuery({ variables: { branchId } });
  const branchData = data?.branchInfo;

  return {
    branchId,
    branchData,
    loading,
  };
};

export default useOfficeProfile;
