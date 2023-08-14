import { useCallback } from 'react';
import { Config, useModal, usePermission } from '@crm/common';
import { LeadCallback } from '__generated__/types';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
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

  const handleLeadClick = useCallback((userId: string) => {
    window.open(`/leads/${userId}`, '_blank');
  }, []);

  const handleCloseUpdateModal = useCallback(() => {
    updateLeadCallbackModal.hide();
    refetch();
  }, [updateLeadCallbackModal, refetch]);

  const handleOpenDeleteModal = useCallback((callback: LeadCallback) => {
    deleteLeadCallbackModal.show({
      callback,
      onSuccess: handleCloseUpdateModal,
    });
  }, [deleteLeadCallbackModal, handleCloseUpdateModal]);

  const handleOpenUpdateModal = useCallback((callback: LeadCallback) => {
    const { callbackId } = callback;

    updateLeadCallbackModal.show({
      callbackId,
      onDelete: () => handleOpenDeleteModal(callback),
    });
  }, [updateLeadCallbackModal, handleOpenDeleteModal]);

  return {
    content,
    loading,
    last,
    refetch,
    allowDeleteCallback,
    handleOpenDeleteModal,
    handleOpenUpdateModal,
    handlePageChanged,
    handleLeadClick,
  };
};

export default useLeadCallbacksGrid;
