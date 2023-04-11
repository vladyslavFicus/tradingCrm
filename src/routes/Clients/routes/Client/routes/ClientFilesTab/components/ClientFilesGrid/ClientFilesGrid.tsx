import React, { useEffect } from 'react';
import I18n from 'i18n-js';
import { useParams } from 'react-router-dom';
import { omit } from 'lodash';
import { getGraphQLUrl, getVersion } from 'config';
import { FileCategories } from 'types/fileCategories';
import { notify, LevelType } from 'providers/NotificationProvider';
import downloadBlob from 'utils/downloadBlob';
import EventEmitter, {
  CLIENT_RELOAD,
  FILE_REMOVED,
  FILE_CHANGED,
  FILE_UPLOADED,
} from 'utils/EventEmitter';
import ShortLoader from 'components/ShortLoader/ShortLoader';
import NotFoundContent from 'components/NotFoundContent';
import FileGrid from './components/FileGrid';
import { useFilesByProfileUuidQuery } from './graphql/__generated__/FilesByProfileUuidQuery';
import { useFilesCategoriesQuery } from './graphql/__generated__/FilesCategoriesQuery';
import { useTokenRefreshMutation } from './graphql/__generated__/TokenRefreshMutation';
import {
  useUpdateFileMetaMutation,
  UpdateFileMetaMutationVariables,
} from './graphql/__generated__/UpdateFileMetaMutation';
import { useUpdateFileStatusMutation } from './graphql/__generated__/UpdateFileStatusMutation';
import './ClientFilesGrid.scss';

const ClientFilesGrid = () => {
  const { id: clientUuid } = useParams<{ id: string }>();

  // ===== Requests ===== //
  const { data, loading, refetch } = useFilesByProfileUuidQuery({
    variables: { clientUuid },
    fetchPolicy: 'network-only',
  });

  const verificationData = data?.clientFiles || [];

  const filesCategoriesQuery = useFilesCategoriesQuery();
  const categoriesData = filesCategoriesQuery.data?.filesCategories || {};
  const categories = omit(categoriesData, '__typename') as FileCategories;

  const [tokenRefreshMutation] = useTokenRefreshMutation();
  const [updateFileMetaMutation] = useUpdateFileMetaMutation();
  const [updateFileStatusMutation] = useUpdateFileStatusMutation();

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, refetch);
    EventEmitter.on(FILE_UPLOADED, refetch);
    EventEmitter.on(FILE_REMOVED, refetch);
    EventEmitter.on(FILE_CHANGED, refetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, refetch);
      EventEmitter.off(FILE_UPLOADED, refetch);
      EventEmitter.off(FILE_REMOVED, refetch);
      EventEmitter.off(FILE_CHANGED, refetch);
    };
  }, []);

  // ===== Handlers ===== //
  const handleStatusActionClick = async (
    verificationType: string,
    documentType: string,
    verificationStatus: string,
  ) => {
    try {
      await updateFileStatusMutation({
        variables: { uuid: clientUuid, verificationType, documentType, verificationStatus },
      });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.STATUS_CHANGED'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleVerificationTypeClick = async (
    uuid: string,
    verificationType: string,
    documentType: string,
  ) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, verificationType, documentType } as UpdateFileMetaMutationVariables,
      });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.DOCUMENT_TYPE_CHANGED'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleChangeFileStatusClick = async (uuid: string, status: string) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, status } as UpdateFileMetaMutationVariables,
      });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('FILES.CHANGED_FILE_STATUS'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('FILES.TITLE'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleUpdateFileMeta = async (uuid: string, title: string) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, title } as UpdateFileMetaMutationVariables,
      });

      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('FILES.DOCUMENT_RENAMED'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('COMMON.SOMETHING_WRONG'),
      });
    }
  };

  const handleDownloadFileClick = async (uuid: string, fileName: string) => {
    try {
      const tokenResponse = await tokenRefreshMutation();
      const token = tokenResponse.data?.auth.tokenRenew?.token;

      if (token) {
        const requestUrl = `${getGraphQLUrl()}/attachment/${clientUuid}/${uuid}`;

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'x-client-version': getVersion(),
          },
        });

        const blobData = await response.blob();

        downloadBlob(fileName, blobData);
      }
    } catch (e) {
      // Do nothing...
    }
  };

  if (loading || filesCategoriesQuery.loading) {
    return <ShortLoader />;
  }

  if (!verificationData.length) {
    return <NotFoundContent />;
  }

  return (
    <div className="ClientFilesGrid">
      {
        verificationData.map(({ documents, verificationType }) => (
          documents.map(({ documentType, files, verificationStatus }) => (
            // @ts-ignore
            <FileGrid
              key={`${verificationType}-${documentType}-${files.length}`}
              data={files}
              categories={categories}
              verificationType={verificationType}
              verificationStatus={verificationStatus}
              documentType={documentType}
              onRefetch={refetch}
              onUpdateFileMeta={handleUpdateFileMeta}
              onTokenRefresh={tokenRefreshMutation}
              onStatusActionClick={handleStatusActionClick}
              onVerificationTypeActionClick={handleVerificationTypeClick}
              onChangeFileStatusActionClick={handleChangeFileStatusClick}
              onDownloadFileClick={handleDownloadFileClick}
            />
          ))
        ))
      }
    </div>
  );
};

export default React.memo(ClientFilesGrid);
