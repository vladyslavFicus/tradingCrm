import React, { useCallback } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { Utils, Types, Constants } from '@crm/common';
import { EditButton, DownloadButton, TrashButton, ShortLoader, SingleSelect } from 'components';
import { File } from '__generated__/types';
import { TokenRefreshMutationMutationFn }
  from 'routes/Clients/routes/Client/routes/ClientFilesTab/graphql/__generated__/TokenRefreshMutation';
import { Table, Column } from 'components/Table';
import GridEmptyValue from 'components/GridEmptyValue';
import Uuid from 'components/Uuid';
import NoteAction from 'components/Note/NoteAction';
import useFileGrid from 'routes/Clients/routes/Client/routes/ClientFilesTab/hooks/useFileGrid';
import MoveFileDropDown from './components/MoveFileDropDown';
import { statusesCategory } from './constants';
import ChangeFileStatusDropDown from './components/ChangeFileStatusDropDown';
import './FileGrid.scss';

type Props = {
  data: Array<File>,
  categories: Types.FileCategories,
  verificationType: string,
  verificationStatus: string,
  documentType: string,
  onRefetch: () => void,
  onTokenRefresh: TokenRefreshMutationMutationFn,
  onUpdateFileMeta: (uuid: string, title: string) => void,
  onStatusActionClick: (verificationType: string, documentType: string, value: string) => void,
  onVerificationTypeActionClick: (uuid: string, verificationType: string, documentType: string) => void,
  onChangeFileStatusActionClick: (uuid: string, status: string) => void,
  onDownloadFileClick: (uuid: string, fileName: string) => void,
};

const FileGrid = (props: Props) => {
  const {
    data,
    categories,
    verificationType,
    verificationStatus,
    documentType,
    onRefetch,
    onTokenRefresh,
    onUpdateFileMeta,
    onStatusActionClick,
    onVerificationTypeActionClick,
    onChangeFileStatusActionClick,
    onDownloadFileClick,
  } = props;

  const {
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
  } = useFileGrid({
    verificationType,
    documentType,
    onTokenRefresh,
    onUpdateFileMeta,
    onStatusActionClick,
    onVerificationTypeActionClick,
    onChangeFileStatusActionClick,
    onRefetch,
  });

  // ===== Renders ===== //
  const renderGridHeader = useCallback(() => (
    <div className="FileGrid__header">
      <div className="FileGrid__header-left">
        <div className="FileGrid__header-category">{I18n.t(`FILES.CATEGORY.${verificationType}`)}</div>

        <If condition={verificationType !== 'OTHER'}>
          <div className="FileGrid__header-separator" />

          <div className="FileGrid__header-document-type">
            {I18n.t(`FILES.DOCUMENTS_TYPE.${documentType}`)}
          </div>
        </If>
      </div>

      <If condition={verificationType !== 'OTHER'}>
        <div className="FileGrid__header-right">
          <div className="FileGrid__header-status">
            <span className="FileGrid__header-status-label">
              {I18n.t('FILES.CHANGE_VERIFICATION_STATUS')}:
            </span>

            <SingleSelect
              value={selectedVerificationStatus || verificationStatus || ''}
              className="FileGrid__header-status-dropdown"
              data-testid="FileGrid-statusesCategorySelect"
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              onChange={handleCahgeStatusesCategorySelect}
              options={statusesCategory.map(({ value, label }) => ({
                label,
                value,
              }))}
            />
          </div>
        </div>
      </If>
    </div>
  ), [
    documentType, handleCahgeStatusesCategorySelect, selectedVerificationStatus,
    verificationStatus, verificationType,
  ]);

  const renderMoveFileDropdown = useCallback(({ uuid, uploadBy }: File) => (
    <MoveFileDropDown
      onMoveChange={handleVerificationTypeChange(uuid)}
      categories={categories}
      uuid={uuid}
      disabled={!allowUpdateFile || uploadBy.indexOf('OPERATOR') === -1}
      verificationType={verificationType}
      documentType={documentType}
    />
  ), [allowUpdateFile, categories, documentType, handleVerificationTypeChange, verificationType]);

  const renderChangeStatusFile = useCallback(({ uuid, status }: File) => (
    <ChangeFileStatusDropDown
      onChangeStatus={handleFileStatusChange}
      uuid={uuid}
      disabled={!allowUpdateFile}
      status={status}
    />
  ), [allowUpdateFile, handleFileStatusChange]);

  const renderFileName = useCallback((file: File) => {
    const { uuid, clientUuid, title, mediaType, fileName, uploadBy } = file;

    const availableToFullScreenFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const isClickable = availableToFullScreenFileTypes.some(fileType => fileType === mediaType);
    const onClick = isClickable ? () => handlePreviewClick(file) : () => {};
    const playerPrefix = clientUuid.indexOf('PLAYER') === -1 ? 'PL' : '';
    const uuidPrefix = clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : 'null';

    return (
      <div className="FileGrid__col FileGrid__col--name">
        <div
          className={classNames('FileGrid__col-title', { 'FileGrid__col-title--clickable': isClickable })}
          onClick={onClick}
        >
          {title}

          <If condition={previewFileUuid === uuid}>
            &nbsp;<ShortLoader className="FileGrid__loader" height={15} />
          </If>
        </div>

        <div className="FileGrid__col-text">
          {fileName === title ? null : `${Utils.shortifyInMiddle(fileName, 40)} - `}

          <Uuid uuid={uuid} />
        </div>

        <div className="FileGrid__col-text">
          {'by '}
          <Uuid
            uuid={uploadBy}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </div>
    );
  }, [handlePreviewClick, previewFileUuid]);

  const renderActions = useCallback((file: File) => (
    <>
      <If condition={allowUpdateFile}>
        <EditButton
          data-testid="FileGrid-editButton"
          onClick={() => handleRenameFile(file)}
        />
      </If>

      {' '}
      <DownloadButton
        data-testid="FileGrid-downloadButton"
        onClick={() => onDownloadFileClick(file.uuid, file.fileName)}
      />
      {' '}

      <If condition={allowDeleteFile}>
        <TrashButton
          data-testid="FileGrid-trashButton"
          onClick={() => handleDeleteClick(file)}
          disabled={file.uploadBy.indexOf('OPERATOR') === -1}
        />
      </If>
    </>
  ), [allowDeleteFile, allowUpdateFile, handleDeleteClick, handleRenameFile, onDownloadFileClick]);

  const renderExpirationDate = useCallback(({ expirationDate }: File) => {
    if (!expirationDate) {
      return <GridEmptyValue />;
    }

    return (
      <>
        <div className="FileGrid__col-title">{moment.utc(expirationDate).local().format('DD.MM.YYYY')}</div>
        <div className="FileGrid__col-text">{moment.utc(expirationDate).local().format('HH:mm:ss')}</div>
      </>
    );
  }, []);

  const renderUploadDate = useCallback(({ uploadDate }: File) => (
    <div className="FileGrid__col-title">{moment.utc(uploadDate).local().format('DD.MM.YYYY')}</div>
  ), []);

  const renderNote = useCallback(({ uuid, clientUuid, note }: File) => (
    <NoteAction
      note={note}
      playerUUID={clientUuid}
      targetUUID={uuid}
      targetType={Constants.targetTypes.FILE}
      onRefetch={onRefetch}
    />
  ), [onRefetch]);

  return (
    <div className={classNames(
      'FileGrid',
      {
        'FileGrid--approved': verificationStatus === 'APPROVED',
        'FileGrid--rejected': verificationStatus === 'REJECTED',
      },
    )}
    >
      {renderGridHeader()}

      <Table items={data}>
        <Column
          header={I18n.t('FILES.GRID.COLUMN.NAME')}
          render={renderFileName}
        />

        <Column render={renderActions} />

        <Column
          header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
          render={renderExpirationDate}
        />

        <If condition={verificationType !== 'OTHER'}>
          <Column
            header={I18n.t('FILES.MOVE_FILE_TO_VERIFICATION_DOCUMENT_TYPE')}
            render={renderMoveFileDropdown}
          />
        </If>

        <Column
          header={I18n.t('FILES.CHANGE_FILE_STATUS')}
          render={renderChangeStatusFile}
        />

        <Column
          header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
          render={renderUploadDate}
        />

        <Column
          header={I18n.t('FILES.GRID.COLUMN.NOTE')}
          render={renderNote}
        />
      </Table>
    </div>
  );
};

export default React.memo(FileGrid);
