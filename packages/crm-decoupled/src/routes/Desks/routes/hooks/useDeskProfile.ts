import { useParams } from 'react-router-dom';
import { BranchInfoQuery, useBranchInfoQuery } from '../graphql/__generated__/BranchInfoQuery';

type BranchInfo = BranchInfoQuery['branchInfo']

type UseDeskProfile = {
  loading: boolean,
  branchData?: BranchInfo,
  branchId: string,
};

const useDeskProfile = (): UseDeskProfile => {
  const branchId = useParams().id as string;

  const { data, loading } = useBranchInfoQuery({ variables: { branchId } });
  const branchData = data?.branchInfo;

  return {
    loading,
    branchData,
    branchId,
  };
};

export default useDeskProfile;
