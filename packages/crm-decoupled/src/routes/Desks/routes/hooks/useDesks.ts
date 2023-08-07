import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { permissions } from 'config';
import { State } from 'types';
import { usePermission } from 'providers/PermissionsProvider';
import { useModal } from 'providers/ModalProvider';
import CreateDeskModal, { CreateDeskModalProps } from 'modals/CreateDeskModal';
import { useDesksListQuery, DesksListQueryVariables, DesksListQuery } from '../graphql/__generated__/DesksListQuery';

type Branch = DesksListQuery['branch'];

type UseDesks = {
  allowCreateBranch: boolean,
  loading: boolean,
  totalCount: number,
  desksList: Branch,
  refetch: () => void,
  handleOpenAddDeskModal: () => void,
};

const useDesks = (): UseDesks => {
  const state = useLocation().state as State<DesksListQueryVariables>;

  const permission = usePermission();
  const allowCreateBranch = permission.allows(permissions.HIERARCHY.CREATE_BRANCH);

  // ===== Modals ===== //
  const createDeskModal = useModal<CreateDeskModalProps>(CreateDeskModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useDesksListQuery({
    variables: {
      ...state?.filters as DesksListQueryVariables,
      branchType: 'desk',
    },
  });

  const desksList = data?.branch || [];
  const totalCount = desksList.length || 0;

  // ===== Handlers ===== //
  const handleOpenAddDeskModal = useCallback(() => {
    createDeskModal.show({
      onSuccess: refetch,
    });
  }, []);

  return {
    allowCreateBranch,
    loading,
    totalCount,
    desksList,
    refetch,
    handleOpenAddDeskModal,
  };
};

export default useDesks;
