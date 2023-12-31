import { useCallback, useState } from 'react';
import I18n from 'i18n-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { Config, Utils, Types, usePermission, useModal, notify, useLightbox } from '@crm/common';
import { DocumentFile } from '__generated__/types';
import ConfirmActionModal, { ConfirmActionModalProps } from 'modals/ConfirmActionModal';
import UpdateDocumentModal, { UpdateDocumentModalProps } from 'modals/UpdateDocumentModal';
import { FormValues } from '../types';
import { useDeleteDocumentMutation } from '../graphql/__generated__/DocumentDeleteMutation';
import { useTokenRenewMutation } from '../graphql/__generated__/TokenRenewMutation';

const useDocumentsGrid = () => {
  const state = useLocation().state as Types.State<FormValues>;

  const navigate = useNavigate();

  // ===== Image Preview ===== //
  const lightbox = useLightbox();

  // ===== Permissions ===== //
  const permission = usePermission();
  const isAllowedToDownload = permission.allows(Config.permissions.DOCUMENTS.DOWNLOAD_DOCUMENT);

  // ===== Modals ===== //
  const confirmActionModal = useModal<ConfirmActionModalProps>(ConfirmActionModal);
  const updateDocumentModal = useModal<UpdateDocumentModalProps>(UpdateDocumentModal);

  // ===== Requests ===== //
  const [tokenRenew] = useTokenRenewMutation();
  const [deleteDocumentMutation] = useDeleteDocumentMutation();

  const [previewFileLoadingUuid, setPreviewFileLoadingUuid] = useState<string | null>(null);

  // ===== Handlers ===== //
  const handleOpenPreview = async (uuid: string, mediaType: string) => {
    try {
      const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};

      const requestUrl = `${Config.getGraphQLUrl()}/documents/${uuid}/file`;

      setPreviewFileLoadingUuid(uuid);

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'x-client-version': Config.getVersion(),
        },
      });

      const fileUrl = URL.createObjectURL(await response.blob());

      setPreviewFileLoadingUuid(null);

      if (mediaType === 'application/pdf') {
        window.open(fileUrl, '_blank');
      } else {
        lightbox.show(fileUrl);
      }
    } catch (e) {
      // Do nothing...
    }
  };

  const isClickableFile = useCallback((mediaType: string) => {
    const availableToFullScreenFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    return availableToFullScreenFileTypes.some(fileType => fileType === mediaType);
  }, []);

  const handleClickPreview = useCallback((uuid: string, mediaType: string) => {
    const isAvailableClick = isClickableFile(mediaType);

    if (isAvailableClick && isAllowedToDownload) handleOpenPreview(uuid, mediaType);
  }, []);

  const handleDeleteDocument = useCallback(({ uuid, title }: DocumentFile, refetch = () => {}) => async () => {
    try {
      await deleteDocumentMutation({ variables: { uuid } });
      confirmActionModal.hide();
      refetch();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('DOCUMENTS.MODALS.DELETE.NOTIFICATIONS.DOCUMENT_DELETED', { title }),
      });
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('DOCUMENTS.MODALS.DELETE.NOTIFICATIONS.DOCUMENT_NOT_DELETED'),
      });
    }
  }, []);

  const handleUpdateDocumentModal = useCallback((item: DocumentFile, refetch = () => {}) => updateDocumentModal
    .show({ item, onSuccess: refetch }), []);

  const handleConfirmDocumentModal = useCallback((item: DocumentFile, refetch = () => {}) => {
    confirmActionModal.show({
      onSubmit: handleDeleteDocument(item, refetch),
      modalTitle: I18n.t('DOCUMENTS.MODALS.DELETE.HEADER'),
      actionText: I18n.t('DOCUMENTS.MODALS.DELETE.ACTION_TEXT', { documentName: item.title }),
      submitButtonLabel: I18n.t('DOCUMENTS.MODALS.DELETE.DELETE'),
    });
  }, []);

  const handleDownloadDocument = useCallback(async (item: DocumentFile) => {
    const { uuid, fileName } = item;

    const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};

    try {
      const requestUrl = `${Config.getGraphQLUrl()}/documents/${uuid}/file`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-client-version': Config.getVersion(),
        },
      });

      const blobData = await response.blob();

      Utils.downloadBlob(fileName, blobData);
    } catch (e) {
      // Do nothing...
    }
  }, []);

  const handleSort = useCallback((sorts: Types.Sort[]) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        sorts,
      },
    });
  }, [state]);

  return {
    permission,
    isAllowedToDownload,
    isClickableFile,
    previewFileLoadingUuid,
    handleConfirmDocumentModal,
    handleUpdateDocumentModal,
    handleClickPreview,
    handleDownloadDocument,
    handleSort,
  };
};

export default useDocumentsGrid;
