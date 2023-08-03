import { useEffect, useCallback } from 'react';
import I18n from 'i18n-js';
import { useParams } from 'react-router-dom';
import { omit } from 'lodash';
import { getGraphQLUrl, getVersion } from 'config';
import { FileCategories } from 'types/fileCategories';
import { notify, LevelType } from 'providers/NotificationProvider';
import downloadBlob from 'utils/downloadBlob';
import EventEmitter, { CLIENT_RELOAD } from 'utils/EventEmitter';
import { useFilesCategoriesQuery } from '../graphql/__generated__/FilesCategoriesQuery';
import { useTokenRefreshMutation } from '../graphql/__generated__/TokenRefreshMutation';
import {
  useUpdateFileMetaMutation,
  UpdateFileMetaMutationVariables,
} from '../graphql/__generated__/UpdateFileMetaMutation';
import { useUpdateFileStatusMutation } from '../graphql/__generated__/UpdateFileStatusMutation';

type Props = {
  onRefetch: () => void,
};

const useClientFilesGrid = (props: Props) => {
  const { onRefetch } = props;

  const { id: clientUuid } = useParams<{ id: string }>();

  const filesCategoriesQuery = useFilesCategoriesQuery();
  const categoriesData = filesCategoriesQuery.data?.filesCategories || {};
  const categories = omit(categoriesData, '__typename') as FileCategories;

  const [tokenRefreshMutation] = useTokenRefreshMutation();
  const [updateFileMetaMutation] = useUpdateFileMetaMutation();
  const [updateFileStatusMutation] = useUpdateFileStatusMutation();

  // ===== Effects ===== //
  useEffect(() => {
    EventEmitter.on(CLIENT_RELOAD, onRefetch);

    return () => {
      EventEmitter.off(CLIENT_RELOAD, onRefetch);
    };
  }, []);

  // ===== Handlers ===== //
  const handleStatusActionClick = useCallback(async (
    verificationType: string,
    documentType: string,
    verificationStatus: string,
  ) => {
    try {
      await updateFileStatusMutation({
        variables: { uuid: clientUuid as string, verificationType, documentType, verificationStatus },
      });

      onRefetch();

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
  }, [clientUuid, onRefetch, updateFileStatusMutation]);

  const handleVerificationTypeClick = useCallback(async (
    uuid: string,
    verificationType: string,
    documentType: string,
  ) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, verificationType, documentType } as UpdateFileMetaMutationVariables,
      });

      onRefetch();

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
  }, [onRefetch, updateFileMetaMutation]);

  const handleChangeFileStatusClick = useCallback(async (uuid: string, status: string) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, status } as UpdateFileMetaMutationVariables,
      });

      onRefetch();

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
  }, [onRefetch, updateFileMetaMutation]);

  const handleUpdateFileMeta = useCallback(async (uuid: string, title: string) => {
    try {
      await updateFileMetaMutation({
        variables: { uuid, title } as UpdateFileMetaMutationVariables,
      });

      onRefetch();

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
  }, [onRefetch, updateFileMetaMutation]);

  const handleDownloadFileClick = useCallback(async (uuid: string, fileName: string) => {
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
  }, [clientUuid, tokenRefreshMutation]);

  return {
    filesCategoriesQuery,
    categories,
    handleUpdateFileMeta,
    tokenRefreshMutation,
    handleStatusActionClick,
    handleVerificationTypeClick,
    handleChangeFileStatusClick,
    handleDownloadFileClick,
  };
};

export default useClientFilesGrid;
