import React from 'react';
import { useParams } from 'react-router-dom';
import I18n from 'i18n-js';
import { useModal } from 'providers/ModalProvider';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { Button } from 'components/Buttons';
import TabHeader from 'components/TabHeader';
import { UploadFileModal } from 'modals/FileModals';
import { UploadFileModalProps } from 'modals/FileModals/UploadFileModal';
import KYCNote from './components/KYCNote';
import ClientFilesGrid from './components/ClientFilesGrid';

const ClientFilesTab = () => {
  const { id: profileUUID } = useParams<{ id: string }>();

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUploadFile = permission.allows(permissions.FILES.UPLOAD_FILE);

  // ===== Modals ===== //
  const uploadModal = useModal<UploadFileModalProps>(UploadFileModal);

  // ===== Handlers ===== //
  const handleUploadFileClick = () => {
    uploadModal.show({ profileUUID });
  };

  return (
    <>
      <TabHeader title={I18n.t('FILES.TITLE')}>
        <If condition={allowUploadFile}>
          <Button
            data-testid="ClientFilesTab-uploadFileButton"
            onClick={handleUploadFileClick}
            tertiary
            small
          >
            {I18n.t('COMMON.BUTTONS.UPLOAD_FILE')}
          </Button>
        </If>
      </TabHeader>

      <KYCNote playerUUID={profileUUID} />

      <ClientFilesGrid />
    </>
  );
};

export default React.memo(ClientFilesTab);
