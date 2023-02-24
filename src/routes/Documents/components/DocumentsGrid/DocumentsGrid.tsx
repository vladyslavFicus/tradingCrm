import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import I18n from 'i18n-js';
import moment from 'moment';
import { useHistory, useLocation } from 'react-router-dom';
import compose from 'compose-function';
import { withModals } from 'hoc';
import { getGraphQLUrl, getVersion } from 'config';
import { Modal, Sort, State } from 'types';
import permissions from 'config/permissions';
import { usePermission } from 'providers/PermissionsProvider';
import { LevelType, notify } from 'providers/NotificationProvider';
import { useModal } from 'providers/ModalProvider';
import downloadBlob from 'utils/downloadBlob';
import ConfirmActionModal from 'modals/ConfirmActionModal';
import AddDocumentModal, { AddDocumentModalProps } from 'modals/AddDocumentModal';
import UpdateDoсumentModal, { UpdateDocumentModalProps } from 'modals/UpdateDoсumentModal';
import { Column, Table } from 'components/Table';
import { Button, DownloadButton, EditButton, TrashButton } from 'components/Buttons';
import Tabs from 'components/Tabs';
import ShortLoader from 'components/ShortLoader';
import { withImages } from 'components/ImageViewer';
import { DocumentsTabs } from '../../constants';
import { useDeleteDocumentMutation } from './graphql/__generated__/DocumentDeleteMutation';
import { useTokenRenewMutation } from './graphql/__generated__/TokenRenewMutation';
import {
  DocumentSearchQuery,
  DocumentSearchQueryVariables,
  useDocumentSearchQuery,
} from './graphql/__generated__/DocumentSearchQuery';
import DocumentFilter from './components/DocumentFilter';
import './DocumentsGrid.scss';

type DocumentItem = ExtractApolloTypeFromPageable<DocumentSearchQuery['documentSearch']>;

type ShowProps = {
  src: string,
}

type Props = {
  modals: {
    deleteModal: Modal<{
      onSubmit: (item: DocumentItem) => void,
      modalTitle: string,
      actionText: string,
      submitButtonLabel: string,
    }>,
  },
  images: {
    show: (prop: Array<ShowProps>) => void,
    close: () => void,
  },
};

const DocumentsGrid = (props: Props) => {
  const { modals, images } = props;

  const { state } = useLocation<State<DocumentSearchQueryVariables['args']>>();

  const history = useHistory();
  const permission = usePermission();

  const updateDoсumentModal = useModal<UpdateDocumentModalProps>(UpdateDoсumentModal);
  const addDocumentModal = useModal<AddDocumentModalProps>(AddDocumentModal);

  const [deleteDocumentMutation] = useDeleteDocumentMutation();
  const [tokenRenew] = useTokenRenewMutation();

  const { data, fetchMore, loading, refetch, variables } = useDocumentSearchQuery({
    variables: {
      args: {
        ...state?.filters,
        page: {
          from: 0,
          size: 20,
          sorts: state?.sorts,
        },
      },
    },
  });

  const { deleteModal } = modals;

  const { content = [], last, number = 0, totalElements = 0 } = data?.documentSearch || {};

  const [previewFileLoadingUuid, setPreviewFileLoadingUuid] = useState<string | null>(null);

  const handleOpenPreview = async (uuid: string, mediaType: string) => {
    try {
      const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};

      const requestUrl = `${getGraphQLUrl()}/attachment/documents/${uuid}/file`;

      setPreviewFileLoadingUuid(uuid);

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
          'x-client-version': getVersion(),
        },
      });

      const fileUrl = URL.createObjectURL(await response.blob());

      setPreviewFileLoadingUuid(null);

      if (mediaType === 'application/pdf') {
        window.open(fileUrl, '_blank');
      } else {
        images.show([{ src: fileUrl }]);
      }
    } catch (e) {
      // Do nothing...
    }
  };

  const isClickableFile = useCallback((mediaType: string) => {
    const availableToFullScreenFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

    return availableToFullScreenFileTypes.some(fileType => fileType === mediaType);
  }, []);

  const handleClickPreview = (uuid: string, mediaType: string) => {
    const isAvailableClick = isClickableFile(mediaType);

    if (isAvailableClick) handleOpenPreview(uuid, mediaType);
  };

  const handleDeleteDocument = ({ uuid, title }: DocumentItem) => async () => {
    try {
      await deleteDocumentMutation({ variables: { uuid } });
      deleteModal.hide();
      refetch();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('DOCUMENTS.MODALS.DELETE.NOTIFICATIONS.DOCUMENT_DELETED', { title }),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('DOCUMENTS.MODALS.DELETE.NOTIFICATIONS.DOCUMENT_NOT_DELETED'),
      });
    }
  };

  const handleDownloadDocument = async (item: DocumentItem) => {
    const { uuid, fileName } = item;

    const { token } = (await tokenRenew()).data?.auth.tokenRenew || {};

    try {
      const requestUrl = `${getGraphQLUrl()}/attachment/documents/${uuid}/file`;

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
    } catch (e) {
      // Do nothing...
    }
  };

  const renderDescription = (item: DocumentItem) => (
    <div className="DocumentsGrid__cell-description">
      {item.description}
    </div>
  );

  const uploadDateColumnRender = (item: DocumentItem) => (
    <div className="DocumentsGrid__cell-primary">
      <div className="DocumentsGrid__cell-primary-date">
        {moment.utc(item.uploadDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="DocumentsGrid__cell-primary-time">
        {moment.utc(item.uploadDate).local().format('HH:mm:ss')}
      </div>
    </div>
  );

  const renderNameColumn = ({ fileName, uuid, title, mediaType }: DocumentItem) => (
    <>
      <div
        onClick={() => handleClickPreview(uuid, mediaType)}
        className={classNames('DocumentsGrid__cell-name', {
          'DocumentsGrid__cell-name--hoverable': isClickableFile(mediaType),
        })}
      >
        {title}
      </div>

      <p className="DocumentsGrid__file-name">{fileName}</p>

      <If condition={previewFileLoadingUuid === uuid}>
        <ShortLoader className="FileGrid__loader" height={15} />
      </If>
    </>
  );

  const actionsColumnRender = (item: DocumentItem) => (
    <div className="DocumentsGrid__cell-buttons">
      <If condition={permission.allows(permissions.DOCUMENTS.DELETE_DOCUMENT)}>
        <TrashButton
          className="DocumentsGrid__action-icon"
          onClick={() => deleteModal.show({
            onSubmit: handleDeleteDocument(item),
            modalTitle: I18n.t('DOCUMENTS.MODALS.DELETE.HEADER'),
            actionText: I18n.t('DOCUMENTS.MODALS.DELETE.ACTION_TEXT', { documentName: item.title }),
            submitButtonLabel: I18n.t('DOCUMENTS.MODALS.DELETE.DELETE'),
          })}
        />
      </If>

      <If condition={permission.allows(permissions.DOCUMENTS.DOWNLOAD_DOCUMENT)}>
        <DownloadButton onClick={() => handleDownloadDocument(item)} />
      </If>

      <If condition={permission.allows(permissions.DOCUMENTS.UPDATE_DOCUMENT)}>
        <EditButton
          className="DocumentsGrid__action-icon"
          onClick={() => updateDoсumentModal.show({ item, onSuccess: refetch })}
        />
      </If>

      <If condition={isClickableFile(item.mediaType)}>
        <Button className="DocumentsGrid__icon-eye" onClick={() => handleClickPreview(item.uuid, item.mediaType)}>
          <i className="fa fa-eye" />
        </Button>
      </If>
    </div>
  );

  const handleSort = (sorts: Sort[]) => {
    history.replace({
      state: {
        ...state,
        sorts,
      },
    });
  };

  const handlePageChanged = () => {
    const filters = state?.filters || {};
    const size = variables?.args?.page?.size;
    const sorts = state?.sorts;

    fetchMore({
      variables: {
        args: {
          ...filters,
          page: {
            from: number + 1,
            size,
            sorts,
          },
        },
      },
    });
  };

  return (
    <div className="DocumentsGrid">
      <Tabs items={DocumentsTabs} className="DocumentsGrid__tabs" />

      <div className="DocumentsGrid__card">
        <div className="DocumentsGrid__headline">
          <strong>{totalElements} </strong>

          {I18n.t('DOCUMENTS.GRID.HEADLINE')}
        </div>

        <If condition={permission.allows(permissions.DOCUMENTS.UPLOAD_DOCUMENT)}>
          <Button
            secondary
            className="DocumentsGrid__header-button"
            onClick={() => addDocumentModal.show({ onSuccess: refetch })}
            type="button"
          >
            {I18n.t('DOCUMENTS.GRID.UPLOAD_FILE')}
          </Button>
        </If>
      </div>

      <DocumentFilter onRefetch={refetch} />

      <Table
        items={content}
        loading={loading}
        onMore={handlePageChanged}
        hasMore={!last}
        stickyFromTop={128}
        onSort={handleSort}
      >
        <Column
          header={I18n.t('DOCUMENTS.GRID.NAME')}
          render={renderNameColumn}
        />

        <Column
          header={I18n.t('DOCUMENTS.GRID.CREATED_AT')}
          render={uploadDateColumnRender}
          sortBy="uploadBy"
        />

        <Column
          header={I18n.t('DOCUMENTS.GRID.DESCRIPTION')}
          render={renderDescription}
        />

        <Column
          header={I18n.t('DOCUMENTS.GRID.ACTION')}
          render={actionsColumnRender}
        />
      </Table>
    </div>
  );
};

export default compose(
  React.memo,
  withModals({
    deleteModal: ConfirmActionModal,
  }),
  withImages,
)(DocumentsGrid);
