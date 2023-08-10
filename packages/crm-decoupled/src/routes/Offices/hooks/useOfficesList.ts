import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Config, usePermission, useModal } from '@crm/common';
import { State } from 'types';
import CreateOfficeModal, { CreateOfficeModalProps } from 'modals/CreateOfficeModal';
import { useOfficesListQuery, OfficesListQueryVariables } from '../graphql/__generated__/OfficesListQuery';

const useOfficesList = () => {
  const state = useLocation().state as State<OfficesListQueryVariables>;

  const permission = usePermission();
  const allowCreateBranch = permission.allows(Config.permissions.HIERARCHY.CREATE_BRANCH);

  // ===== Modals ===== //
  const createOfficeModal = useModal<CreateOfficeModalProps>(CreateOfficeModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useOfficesListQuery({
    variables: {
      ...state?.filters as OfficesListQueryVariables,
      branchType: 'office',
    },
  });

  const officesList = data?.branch || [];
  const totalCount = officesList.length || 0;

  // ===== Handlers ===== //
  const handleOpenAddOfficeModal = useCallback(() => {
    createOfficeModal.show({
      onSuccess: refetch,
    });
  }, []);

  return {
    allowCreateBranch,
    officesList,
    totalCount,
    loading,
    refetch,
    handleOpenAddOfficeModal,
  };
};

export default useOfficesList;
