import React, { useCallback } from 'react';
import I18n from 'i18n-js';
import moment from 'moment';
import classNames from 'classnames';
import { DocumentFile } from '__generated__/types';
import permissions from 'config/permissions';
import { Table, Column } from 'components/Table';
import { TrashButton, EditButton, DownloadButton, Button } from 'components/Buttons';
import ShortLoader from 'components/ShortLoader';
import useDocuments from 'routes/Documents/routes/hooks/useDocuments';
import useDocumentsGrid from 'routes/Documents/routes/hooks/useDocumentsGrid';
import './DocumentsGrid.scss';

const DocumentsGrid = () => {
  const {
    content,
    last,
    loading,
    refetch,
    handlePageChanged,
  } = useDocuments();

  const {
    permission,
    isAllowedToDownload,
    isClickableFile,
    previewFileLoadingUuid,
    handleConfirmDocumentModal,
    handleUpdateDocumentModal,
    handleClickPreview,
    handleDownloadDocument,
    handleSort,
  } = useDocumentsGrid();

  const renderDescription = useCallback((item: DocumentFile) => (
    <div className="DocumentsGrid__cell-description">
      {item.description}
    </div>
  ), []);

  const uploadDateColumnRender = useCallback((item: DocumentFile) => (
    <div className="DocumentsGrid__cell-primary">
      <div className="DocumentsGrid__cell-primary-date">
        {moment.utc(item.uploadDate).local().format('DD.MM.YYYY')}
      </div>

      <div className="DocumentsGrid__cell-primary-time">
        {moment.utc(item.uploadDate).local().format('HH:mm:ss')}
      </div>
    </div>
  ), []);

  const renderNameColumn = useCallback(({ fileName, uuid, title, mediaType }: DocumentFile) => (
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
  ), []);

  const actionsColumnRender = useCallback((item: DocumentFile) => (
    <div className="DocumentsGrid__cell-buttons">
      <If condition={permission.allows(permissions.DOCUMENTS.DELETE_DOCUMENT)}>
        <TrashButton
          className="DocumentsGrid__action-icon"
          data-testid="DocumentsGrid-trashButton"
          onClick={() => handleConfirmDocumentModal(item, refetch)}
        />
      </If>

      <If condition={isAllowedToDownload}>
        <DownloadButton
          data-testid="DocumentsGrid-downloadButton"
          onClick={() => handleDownloadDocument(item)}
        />
      </If>

      <If condition={permission.allows(permissions.DOCUMENTS.UPDATE_DOCUMENT)}>
        <EditButton
          className="DocumentsGrid__action-icon"
          data-testid="DocumentsGrid-editButton"
          onClick={() => handleUpdateDocumentModal(item, refetch)}
        />
      </If>

      <If condition={isClickableFile(item.mediaType) && isAllowedToDownload}>
        <Button
          className="DocumentsGrid__icon-eye"
          data-testid="DocumentsGrid-previewButton"
          onClick={() => handleClickPreview(item.uuid, item.mediaType)}
        >
          <i className="fa fa-eye" />
        </Button>
      </If>
    </div>
  ), []);

  return (
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
        sortBy="uploadDate"
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
  );
};

export default React.memo(DocumentsGrid);
