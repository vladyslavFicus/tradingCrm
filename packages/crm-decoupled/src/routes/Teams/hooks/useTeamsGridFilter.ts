import { useDesksAndOfficesListQuery } from '../graphql/__generated__/DesksAndOfficesListQuery';

const useTeamsGridFilter = () => {
  // ===== Requests ===== //
  const desksAndOfficesQuery = useDesksAndOfficesListQuery({ fetchPolicy: 'network-only' });

  const { data, loading } = desksAndOfficesQuery;
  const officesList = data?.userBranches?.OFFICE || [];
  const desksList = data?.userBranches?.DESK || [];

  return {
    loading,
    officesList,
    desksList,
  };
};

export default useTeamsGridFilter;
