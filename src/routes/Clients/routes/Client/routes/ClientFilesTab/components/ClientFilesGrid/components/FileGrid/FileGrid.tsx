import React, { useState } from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { getGraphQLUrl, getVersion } from 'config';
import { FileCategories } from 'types/fileCategories';
import { File } from '__generated__/types';
import { useModal } from 'providers/ModalProvider';
import { useLightbox } from 'providers/LightboxProvider/useLightbox';
import { usePermission } from 'providers/PermissionsProvider';
import permissions from 'config/permissions';
import { targetTypes } from 'constants/note';
import { shortifyInMiddle } from 'utils/stringFormat';
import { Table, Column } from 'components/Table';
import { EditButton, DownloadButton, TrashButton } from 'components/Buttons';
import GridEmptyValue from 'components/GridEmptyValue';
import Select from 'components/Select';
import Uuid from 'components/Uuid';
import { DeleteFileModal, RenameFileModal } from 'modals/FileModals';
import { DeleteFileModalProps } from 'modals/FileModals/DeleteFileModal';
import { RenameFileModalProps } from 'modals/FileModals/RenameFileModal';
import ShortLoader from 'components/ShortLoader';
import NoteAction from 'components/Note/NoteAction';
import { VerificationType } from '../../types';
import { TokenRefreshMutationMutationFn } from '../../graphql/__generated__/TokenRefreshMutation';
import MoveFileDropDown from './components/MoveFileDropDown';
import ChangeFileStatusDropDown from './components/ChangeFileStatusDropDown';
import { statusesCategory } from './constants';
import './FileGrid.scss';

type Props = {
  data: Array<File>,
  categories: FileCategories,
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

  const [previewFileUuid, setPreviewFileUuid] = useState<string | null>(null);
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState<string>('');

  // ===== Permissions ===== //
  const permission = usePermission();
  const allowUpdateFile = permission.allows(permissions.USER_PROFILE.UPLOAD_FILE);
  const allowDeleteFile = permission.allows(permissions.USER_PROFILE.DELETE_FILE);

  // ===== Image Preview ===== //
  const lightbox = useLightbox();

  // ===== Modals ===== //
  const deleteFileModal = useModal<DeleteFileModalProps>(DeleteFileModal);
  const renameFileModal = useModal<RenameFileModalProps>(RenameFileModal);

  // ===== Handlers ===== //
  const handleVerificationStatusChange = (value: string) => {
    onStatusActionClick(verificationType, documentType, value);
  };

  const handleVerificationTypeChange = (uuid: string) => (value: VerificationType) => {
    onVerificationTypeActionClick(uuid, value.verificationType, value.documentType);
  };

  const handleFileStatusChange = (uuid: string, status: string) => {
    onChangeFileStatusActionClick(uuid, status);
  };

  const handleUpdateFileMeta = async (uuid: string, title: string) => {
    await onUpdateFileMeta(uuid, title);
  };

  const handlePreviewClick = async ({ uuid, clientUuid, mediaType }: File) => {
    try {
      const tokenResponse = await onTokenRefresh();
      const token = tokenResponse.data?.auth.tokenRenew?.token;

      if (token) {
        const requestUrl = `${getGraphQLUrl()}/attachment/${clientUuid}/${uuid}`;

        setPreviewFileUuid(uuid);

        const response = await fetch(requestUrl, {
          method: 'GET',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
            'x-client-version': getVersion(),
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
  };

  const handleDeleteClick = (file: File) => {
    deleteFileModal.show({ file });
  };

  const handleRenameFile = ({ uuid, fileName, title }: File) => {
    renameFileModal.show({
      uuid,
      fileName,
      title,
      onSubmit: renameFileModal.hide,
      onUpdateFileMeta: handleUpdateFileMeta,
    });
  };

  // ===== Renders ===== //
  const renderGridHeader = () => (
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

            <Select
              // @ts-ignore Select component write by js
              value={selectedVerificationStatus || verificationStatus || ''}
              customClassName="FileGrid__header-status-dropdown"
              data-testid="FileGrid-statusesCategorySelect"
              onChange={(value: string) => {
                setSelectedVerificationStatus(value);
                handleVerificationStatusChange(value);
              }}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
            >
              {statusesCategory.map(({ value, label }) => (
                <option key={`${verificationType}-${documentType}-${value}`} value={value}>{I18n.t(label)}</option>
              ))}
            </Select>
          </div>
        </div>
      </If>
    </div>
  );

  const renderMoveFileDropdown = ({ uuid, uploadBy }: File) => (
    <MoveFileDropDown
      onMoveChange={handleVerificationTypeChange(uuid)}
      categories={categories}
      uuid={uuid}
      disabled={!allowUpdateFile || uploadBy.indexOf('OPERATOR') === -1}
      verificationType={verificationType}
      documentType={documentType}
    />
  );

  const renderChangeStatusFile = ({ uuid, status }: File) => (
    <ChangeFileStatusDropDown
      onChangeStatus={handleFileStatusChange}
      uuid={uuid}
      disabled={!allowUpdateFile}
      status={status}
    />
  );

  const renderFileName = (file: File) => {
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
          {fileName === title ? null : `${shortifyInMiddle(fileName, 40)} - `}

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
  };

  const renderActions = (file: File) => (
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
  );

  const renderExpirationDate = ({ expirationDate }: File) => {
    if (!expirationDate) {
      return <GridEmptyValue />;
    }

    return (
      <>
        <div className="FileGrid__col-title">{moment.utc(expirationDate).local().format('DD.MM.YYYY')}</div>
        <div className="FileGrid__col-text">{moment.utc(expirationDate).local().format('HH:mm:ss')}</div>
      </>
    );
  };

  const renderUploadDate = ({ uploadDate }: File) => (
    <div className="FileGrid__col-title">{moment.utc(uploadDate).local().format('DD.MM.YYYY')}</div>
  );

  const renderNote = ({ uuid, clientUuid, note }: File) => (
    <NoteAction
      note={note}
      playerUUID={clientUuid}
      targetUUID={uuid}
      targetType={targetTypes.FILE}
      onRefetch={onRefetch}
    />
  );

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
