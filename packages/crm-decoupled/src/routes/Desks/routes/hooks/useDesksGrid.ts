import { useCallback } from 'react';
import { Config, usePermission, useModal } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import DeleteBranchModal, { DeleteBranchModalProps } from 'modals/DeleteBranchModal';
import UpdateDeskModal, { UpdateDeskModalProps } from 'modals/UpdateDeskModal';

type UseDesksGrid = {
  isAllowUpdateBranch: boolean,
  isAllowDeleteBranch: boolean,
  isAllowActions: boolean,
  handleEditClick: (prop: HierarchyBranch, refetch: () => void) => void,
  handleDeleteClick: (prop: HierarchyBranch, refetch: () => void) => void,
};

const useDesksGrid = (): UseDesksGrid => {
  const permission = usePermission();

  const isAllowUpdateBranch = permission.allows(Config.permissions.HIERARCHY.UPDATE_BRANCH);
  const isAllowDeleteBranch = permission.allows(Config.permissions.HIERARCHY.DELETE_BRANCH);
  const isAllowActions = isAllowUpdateBranch || isAllowDeleteBranch;

  // ===== Modals ===== //
  const deleteBranchModal = useModal<DeleteBranchModalProps>(DeleteBranchModal);
  const updateDeskModal = useModal<UpdateDeskModalProps>(UpdateDeskModal);

  // ===== Handlers ===== //
  const handleEditClick = useCallback((desk: HierarchyBranch, refetch = () => {}) => {
    updateDeskModal.show({
      data: desk,
      onSuccess: refetch,
    });
  }, []);

  const handleDeleteClick = useCallback(({ uuid, name }: HierarchyBranch, refetch = () => {}) => {
    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: refetch,
    });
  }, []);

  return {
    isAllowUpdateBranch,
    isAllowDeleteBranch,
    isAllowActions,
    handleEditClick,
    handleDeleteClick,
  };
};

export default useDesksGrid;
