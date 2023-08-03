import { useCallback } from 'react';
import { ClientCallback } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import useHandlePageChanged from 'hooks/useHandlePageChanged';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import UpdateClientCallbackModal, { UpdateClientCallbackModalProps } from 'modals/UpdateClientCallbackModal';
import DeleteClientCallbackModal, { DeleteClientCallbackModalProps } from 'modals/DeleteClientCallbackModal';
import {
  ClientCallbacksListQueryQueryResult,
} from '../graphql/__generated__/ClientCallbacksListQuery';

type Props = {
  clientCallbacksListQuery: ClientCallbacksListQueryQueryResult,
};

const useClientCallbacksGrid = (props: Props) => {
  const { clientCallbacksListQuery } = props;

  const { data, loading, refetch } = clientCallbacksListQuery;

  const { content = [], last = false } = clientCallbacksListQuery?.data?.clientCallbacks || {};

  const permission = usePermission();
  const allowDeleteCallback = permission.allows(permissions.USER_PROFILE.DELETE_CALLBACK);

  // ===== Modals ===== //
  const updateClientCallbackModal = useModal<UpdateClientCallbackModalProps>(UpdateClientCallbackModal);
  const deleteClientCallbackModal = useModal<DeleteClientCallbackModalProps>(DeleteClientCallbackModal);

  // ===== Handlers ===== //
  const page = data?.clientCallbacks?.page || 0;
  const handlePageChanged = useHandlePageChanged({
    query: clientCallbacksListQuery,
    page,
    path: 'page.from',
  });

  const handleCloseUpdateModal = useCallback(() => {
    updateClientCallbackModal.hide();
    refetch();
  }, [updateClientCallbackModal, refetch]);

  const handleOpenDeleteModal = useCallback((callback: ClientCallback) => {
    deleteClientCallbackModal.show({
      callback,
      onSuccess: handleCloseUpdateModal,
    });
  }, [deleteClientCallbackModal, handleCloseUpdateModal]);

  const handleOpenUpdateModal = useCallback((callback: ClientCallback) => {
    const { callbackId } = callback;

    updateClientCallbackModal.show({
      callbackId,
      onDelete: () => handleOpenDeleteModal(callback),
    });
  }, [updateClientCallbackModal, handleOpenDeleteModal]);

  return {
    loading,
    handlePageChanged,
    refetch,
    content,
    last,
    handleOpenUpdateModal,
    handleOpenDeleteModal,
    allowDeleteCallback,
  };
};

export default useClientCallbacksGrid;
