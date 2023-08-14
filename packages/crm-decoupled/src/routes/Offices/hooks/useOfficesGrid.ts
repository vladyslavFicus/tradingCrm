import { useCallback } from 'react';
import { Config, usePermission, useModal } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import UpdateOfficeModal, { UpdateOfficeModalProps } from 'modals/UpdateOfficeModal';
import DeleteBranchModal, { DeleteBranchModalProps } from 'modals/DeleteBranchModal';

type Props = {
  onRefetch: () => void,
};

const useOfficesGrid = (props: Props) => {
  const { onRefetch } = props;

  const permission = usePermission();

  const isAllowUpdateBranch = permission.allows(Config.permissions.HIERARCHY.UPDATE_BRANCH);
  const isAllowDeleteBranch = permission.allows(Config.permissions.HIERARCHY.DELETE_BRANCH);
  const isAllowActions = isAllowUpdateBranch || isAllowDeleteBranch;

  // ===== Modals ===== //
  const deleteBranchModal = useModal<DeleteBranchModalProps>(DeleteBranchModal);
  const updateOfficeModal = useModal<UpdateOfficeModalProps>(UpdateOfficeModal);

  // ===== Handlers ===== //
  const handleEditClick = useCallback((data: HierarchyBranch) => {
    updateOfficeModal.show({
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
    isAllowActions,
    isAllowUpdateBranch,
    isAllowDeleteBranch,
    handleEditClick,
    handleDeleteClick,
  };
};

export default useOfficesGrid;
