import React from 'react';
import I18n from 'i18n-js';
import { Button } from 'components';
import TabHeader from 'components/TabHeader';
import useClientFilesTab from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useClientFilesTab';
import KYCNote from './components/KYCNote';
import ClientFilesGrid from './components/ClientFilesGrid';

const ClientFilesTab = () => {
  const {
    profileUUID,
    allowUploadFile,
    verificationData,
    loading,
    refetch,
    handleUploadFileClick,
  } = useClientFilesTab();

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

      <ClientFilesGrid
        verificationData={verificationData}
        loading={loading}
        onRefetch={refetch}
      />
    </>
  );
};

export default React.memo(ClientFilesTab);
