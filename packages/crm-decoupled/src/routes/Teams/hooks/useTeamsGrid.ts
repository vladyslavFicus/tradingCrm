import { useCallback } from 'react';
import { Config, usePermission, useModal } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import UpdateTeamModal, { UpdateTeamModalProps } from 'modals/UpdateTeamModal';
import DeleteBranchModal, { DeleteBranchModalProps } from 'modals/DeleteBranchModal';

type Props = {
  onRefetch: () => void,
};

const useTeamsGrid = (props: Props) => {
  const { onRefetch } = props;

  const permission = usePermission();

  const isAllowUpdateBranch = permission.allows(Config.permissions.HIERARCHY.UPDATE_BRANCH);
  const isAllowDeleteBranch = permission.allows(Config.permissions.HIERARCHY.DELETE_BRANCH);
  const isAllowActions = isAllowUpdateBranch || isAllowDeleteBranch;

  // ===== Modals ===== //
  const deleteBranchModal = useModal<DeleteBranchModalProps>(DeleteBranchModal);
  const updateTeamModal = useModal<UpdateTeamModalProps>(UpdateTeamModal);

  // ===== Handlers ===== //
  const handleEditClick = useCallback((data: HierarchyBranch) => {
    updateTeamModal.show({
      data,
      onSuccess: onRefetch,
    });
  }, []);

  const handleDeleteClick = useCallback(({ uuid, name }: HierarchyBranch) => {
    deleteBranchModal.show({
      uuid,
      name,
      onSuccess: onRefetch,
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

export default useTeamsGrid;
