
import { Config } from '@crm/common';
import { LeadCallback } from '__generated__/types';
import { usePermission } from 'providers/PermissionsProvider';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { useModal } from 'providers/ModalProvider';
import UpdateLeadCallbackModal, { UpdateLeadCallbackModalProps } from 'modals/UpdateLeadCallbackModal';
import DeleteLeadCallbackModal, { DeleteLeadCallbackModalProps } from 'modals/DeleteLeadCallbackModal';
import {
  LeadCallbacksListQueryQueryResult,
} from '../graphql/__generated__/LeadCallbacksListQuery';

type Props = {
  leadCallbacksListQuery: LeadCallbacksListQueryQueryResult,
};

const useLeadCallbacksGrid = (props: Props) => {
  const { leadCallbacksListQuery } = props;
  const { data, loading, refetch } = leadCallbacksListQuery;
  const { content = [], last = false, page = 0 } = data?.leadCallbacks || {};


  // ===== Permissions ===== //
  const permission = usePermission();
  const allowDeleteCallback = permission.allows(Config.permissions.USER_PROFILE.DELETE_CALLBACK);

  // ===== Modals ===== //
  const deleteLeadCallbackModal = useModal<DeleteLeadCallbackModalProps>(DeleteLeadCallbackModal);
  const updateLeadCallbackModal = useModal<UpdateLeadCallbackModalProps>(UpdateLeadCallbackModal);

  // ===== Handlers ===== //
  const handlePageChanged = useHandlePageChanged({
    query: leadCallbacksListQuery,
    page,
    path: 'page.from',
  });

  const handleCloseUpdateModal = () => {
    updateLeadCallbackModal.hide();
    leadCallbacksListQuery.refetch();
  };

  const handleOpenDeleteModal = (callback: LeadCallback) => {
    deleteLeadCallbackModal.show({
      callback,
      onSuccess: handleCloseUpdateModal,
    });
  };

  const handleOpenUpdateModal = (callback: LeadCallback) => {
    const { callbackId } = callback;
    updateLeadCallbackModal.show({
      callbackId,
      onDelete: () => handleOpenDeleteModal(callback),
    });
  };

  return {
    content,
    loading,
    last,
    refetch,
    allowDeleteCallback,
    handleOpenDeleteModal,
    handleOpenUpdateModal,
    handlePageChanged,
  };
};

export default useLeadCallbacksGrid;
