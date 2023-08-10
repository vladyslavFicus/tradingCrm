import { useCallback, useState } from 'react';
import { Config, useModal, usePermission, useLightbox } from '@crm/common';
import { File } from '__generated__/types';
import { DeleteFileModal, RenameFileModal } from 'modals/FileModals';
import { DeleteFileModalProps } from 'modals/FileModals/DeleteFileModal';
import { RenameFileModalProps } from 'modals/FileModals/RenameFileModal';
import { VerificationType } from '../types/clientFilesGrid';
import { TokenRefreshMutationMutationFn } from '../graphql/__generated__/TokenRefreshMutation';

type Props = {
  verificationType: string,
  documentType: string,
  onTokenRefresh: TokenRefreshMutationMutationFn,
  onUpdateFileMeta: (uuid: string, title: string) => void,
  onStatusActionClick: (verificationType: string, documentType: string, value: string) => void,
  onVerificationTypeActionClick: (uuid: string, verificationType: string, documentType: string) => void,
  onChangeFileStatusActionClick: (uuid: string, status: string) => void,
  onRefetch: () => void,
};

const useFileGrid = (props: Props) => {
  const {
    verificationType,
    documentType,
    onTokenRefresh,
    onUpdateFileMeta,
    onStatusActionClick,
    onVerificationTypeActionClick,
    onChangeFileStatusActionClick,
    onRefetch,
  } = props;

  const [previewFileUuid, setPreviewFileUuid] = useState<string | null>(null);
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState<string>('');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateFile = permission.allows(Config.permissions.USER_PROFILE.UPLOAD_FILE);
  const allowDeleteFile = permission.allows(Config.permissions.USER_PROFILE.DELETE_FILE);

  // ===== Image Preview ===== //
  const lightbox = useLightbox();

  // ===== Modals ===== //
  const deleteFileModal = useModal<DeleteFileModalProps>(DeleteFileModal);
  const renameFileModal = useModal<RenameFileModalProps>(RenameFileModal);

  // ===== Handlers ===== //
  const handleVerificationStatusChange = useCallback((value: string) => {
    onStatusActionClick(verificationType, documentType, value);
  }, [documentType, onStatusActionClick, verificationType]);

  const handleVerificationTypeChange = useCallback((uuid: string) => (value: VerificationType) => {
    onVerificationTypeActionClick(uuid, value.verificationType, value.documentType);
  }, [onVerificationTypeActionClick]);

  const handleFileStatusChange = useCallback((uuid: string, status: string) => {
    onChangeFileStatusActionClick(uuid, status);
  }, [onChangeFileStatusActionClick]);

  const handleUpdateFileMeta = useCallback(async (uuid: string, title: string) => {
    await onUpdateFileMeta(uuid, title);
  }, [onUpdateFileMeta]);

  const handlePreviewClick = useCallback(async ({ uuid, clientUuid, mediaType }: File) => {
    try {
      const tokenResponse = await onTokenRefresh();
      const token = tokenResponse.data?.auth.tokenRenew?.token;

      if (token) {
        const requestUrl = `${Config.getGraphQLUrl()}/attachment/${clientUuid}/${uuid}`;

        setPreviewFileUuid(uuid);

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            'x-client-version': Config.getVersion(),
          },
        });

        const fileUrl = URL.createObjectURL(await response.blob());

        setPreviewFileUuid(null);

        if (mediaType === 'application/pdf') {
          window.open(fileUrl, '_blank');
        } else {
          lightbox.show(fileUrl);
        }
      }
    } catch (e) {
      // Do nothing...
    }
  }, [lightbox, onTokenRefresh]);

  const handleDeleteClick = useCallback((file: File) => {
    deleteFileModal.show({
      file,
      onSuccess: onRefetch,
    });
  }, [deleteFileModal, onRefetch]);

  const handleRenameFile = useCallback(({ uuid, fileName, title }: File) => {
    renameFileModal.show({
      uuid,
      fileName,
      title,
      onSubmit: renameFileModal.hide,
      onUpdateFileMeta: handleUpdateFileMeta,
    });
  }, [handleUpdateFileMeta, renameFileModal]);

  const handleCahgeStatusesCategorySelect = useCallback((value: string) => {
    setSelectedVerificationStatus(value);
    handleVerificationStatusChange(value);
  }, [handleVerificationStatusChange]);

  return {
    previewFileUuid,
    selectedVerificationStatus,
    allowUpdateFile,
    allowDeleteFile,
    handleVerificationTypeChange,
    handleFileStatusChange,
    handlePreviewClick,
    handleCahgeStatusesCategorySelect,
    handleDeleteClick,
    handleRenameFile,
  };
};

export default useFileGrid;
