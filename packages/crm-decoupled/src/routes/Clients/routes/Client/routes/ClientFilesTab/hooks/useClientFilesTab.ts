import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Config, useModal, usePermission } from '@crm/common';
import { UploadFileModal } from 'modals/FileModals';
import { UploadFileModalProps } from 'modals/FileModals/UploadFileModal';
import { useFilesByProfileUuidQuery } from '../graphql/__generated__/FilesByProfileUuidQuery';

const useClientFilesTab = () => {
  const profileUUID = useParams().id as string;

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUploadFile = permission.allows(Config.permissions.FILES.UPLOAD_FILE);

  // ===== Modals ===== //
  const uploadModal = useModal<UploadFileModalProps>(UploadFileModal);

  // ===== Requests ===== //
  const { data, loading, refetch } = useFilesByProfileUuidQuery({
    variables: { clientUuid: profileUUID },
    fetchPolicy: 'network-only',
  });

  const verificationData = data?.clientFiles || [];

  // ===== Handlers ===== //
  const handleUploadFileClick = useCallback(() => {
    uploadModal.show({
      profileUUID,
      onSuccess: refetch,
    });
  }, [profileUUID, uploadModal, refetch]);

  return {
    profileUUID,
    allowUploadFile,
    verificationData,
    loading,
    refetch,
    handleUploadFileClick,
  };
};

export default useClientFilesTab;
