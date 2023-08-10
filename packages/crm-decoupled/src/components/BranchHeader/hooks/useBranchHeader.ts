import { useCallback } from 'react';
import I18n from 'i18n-js';
import { Config, usePermission, useModal } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import AddBranchManagerModal, { AddBranchManagerModalProps } from 'modals/AddBranchManagerModal';
import RemoveBranchManagerModal, { RemoveBranchManagerModalProps } from 'modals/RemoveBranchManagerModal';
import { useGetBranchManagerQuery } from '../graphql/__generated__/GetBranchManagerQuery';

type Props = {
  branchId: string,
  branchData: HierarchyBranch,
};

type Operator = {
  uuid: string,
  fullName: string | null,
  operatorStatus: string | null,
}

type UseBranchHeader = {
  allowRemoveBrandManager: boolean,
  allowAddBrandManager: boolean,
  handleOpenConfirmActionModal: () => void,
  handleOpenManagerModal: () => void,
  operators: Array<Operator>,
};

const useBranchHeader = (props: Props): UseBranchHeader => {
  const { branchId, branchData: { branchType, uuid, name } } = props;

  const permission = usePermission();

  const allowRemoveBrandManager = permission.allows(Config.permissions.HIERARCHY.REMOVE_BRAND_MANAGER);
  const allowAddBrandManager = permission.allows(Config.permissions.HIERARCHY.ADD_BRAND_MANAGER);

  // ===== Modals ===== //
  const addBranchManagerModal = useModal<AddBranchManagerModalProps>(AddBranchManagerModal);
  const removeBranchManagerModal = useModal<RemoveBranchManagerModalProps>(RemoveBranchManagerModal);

  // ===== Requests ===== //
  const { data, refetch } = useGetBranchManagerQuery({
    variables: { branchId },
    fetchPolicy: 'network-only',
  });

  const branchInfo = data?.branchInfo;
  const managers = branchInfo?.managers || [];
  const operators = branchInfo?.operators || [];

  // ===== Handlers ===== //
  const handleOpenConfirmActionModal = useCallback(() => {
    removeBranchManagerModal.show({
      title: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.TITLE'),
      description: I18n.t('MODALS.REMOVE_BRANCH_MANAGER_MODAL.DESCRIPTION'),
      branch: { uuid },
      operators,
      onSuccess: refetch,
    });
  }, [operators]);

  const handleOpenManagerModal = useCallback(() => {
    addBranchManagerModal.show({
      title: I18n.t('MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TITLE'),
      description: I18n.t(
        `MODALS.ADD_BRANCH_MANAGER_MODAL.ADD_TO_${branchType}`,
        { branch: name },
      ),
      branch: { uuid, name, branchType },
      managers,
      onSuccess: refetch,
    });
  }, [managers]);

  return {
    allowRemoveBrandManager,
    allowAddBrandManager,
    handleOpenConfirmActionModal,
    handleOpenManagerModal,
    operators,
  };
};

export default useBranchHeader;
