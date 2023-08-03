import { HierarchyBranch } from '__generated__/types';
import { useOfficesListQuery } from '../graphql/__generated__/OfficesListQuery';

type UseDesksFilter = {
  officesList: Array<HierarchyBranch>,
};

const useDesksFilter = (): UseDesksFilter => {
  // ===== Requests ===== //
  const officesListQuery = useOfficesListQuery({ fetchPolicy: 'network-only' });

  const officesList = officesListQuery.data?.userBranches?.OFFICE || [];

  return {
    officesList,
  };
};

export default useDesksFilter;
