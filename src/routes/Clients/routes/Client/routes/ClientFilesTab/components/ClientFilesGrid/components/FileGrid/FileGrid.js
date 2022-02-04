import React, { PureComponent } from 'react';
import compose from 'compose-function';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { withModals } from 'hoc';
import { getGraphQLUrl, getVersion } from 'config';
import permissions from 'config/permissions';
import PropTypes from 'constants/propTypes';
import { targetTypes } from 'constants/note';
import { shortifyInMiddle } from 'utils/stringFormat';
import PermissionContent from 'components/PermissionContent';
import { Table, Column } from 'components/Table';
import NoteButton from 'components/NoteButton';
import { EditButton, DownloadButton, TrashButton } from 'components/UI';
import GridEmptyValue from 'components/GridEmptyValue';
import Select from 'components/Select';
import Uuid from 'components/Uuid';
import { withImages } from 'components/ImageViewer';
import { DeleteModal, RenameModal } from 'components/Files';
import ShortLoader from 'components/ShortLoader';
import { statusesCategory, statusesFile } from './constants';
import MoveFileDropDown from './components/MoveFileDropDown';
import ChangeFileStatusDropDown from './components/ChangeFileStatusDropDown';
import './FileGrid.scss';

class FileGrid extends PureComponent {
  static propTypes = {
    ...withImages.propTypes,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    verificationType: PropTypes.string.isRequired,
    verificationStatus: PropTypes.string,
    documentType: PropTypes.string.isRequired,
    onStatusActionClick: PropTypes.func.isRequired,
    onVerificationTypeActionClick: PropTypes.func.isRequired,
    onChangeFileStatusActionClick: PropTypes.func.isRequired,
    onDownloadFileClick: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      deleteFileModal: PropTypes.modalType,
      renameFileModal: PropTypes.modalType,
    }).isRequired,
    updateFileMeta: PropTypes.func.isRequired,
    tokenRenew: PropTypes.func.isRequired,
  }

  static defaultProps = {
    verificationStatus: null,
  }

  state = {
    previewFileLoadingUuid: null,
    selectedVerificationStatusValue: '',
  }

  onVerificationStatusChange = (value) => {
    const { verificationType, documentType } = this.props;

    this.props.onStatusActionClick(verificationType, documentType, value);
  }

  onVerificationTypeChange = uuid => ({ verificationType, documentType }) => {
    this.props.onVerificationTypeActionClick(uuid, verificationType, documentType);
  }

  onFileStatusChange = (status, uuid) => {
    this.props.onChangeFileStatusActionClick(status, uuid);
  }

  onPreviewClick = async ({ uuid, clientUuid, mediaType }) => {
    const { tokenRenew } = this.props;

    try {
      const { data: { auth: { tokenRenew: { token } } } } = await tokenRenew();

      const requestUrl = `${getGraphQLUrl()}/attachment/${clientUuid}/${uuid}`;

      this.setState({ previewFileLoadingUuid: uuid });

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
          'x-client-version': getVersion(),
        },
      });

      const fileUrl = URL.createObjectURL(await response.blob());

      this.setState({ previewFileLoadingUuid: null });

      if (mediaType === 'application/pdf') {
        window.open(fileUrl, '_blank');
      } else {
        this.props.images.show([{ src: fileUrl }]);
      }
    } catch (e) {
      // Do nothing...
    }
  };

  onDeleteClick = (file) => {
    const { modals: { deleteFileModal } } = this.props;

    deleteFileModal.show({ file });
  };

  handleRenameFile = ({ uuid, fileName }) => {
    const {
      modals: {
        renameFileModal,
      },
      updateFileMeta,
    } = this.props;

    renameFileModal.show({
      uuid,
      fileName,
      onSubmit: renameFileModal.hide,
      updateFileMeta,
    });
  };

  renderGridHeader = () => {
    const { verificationStatus, documentType, verificationType } = this.props;
    const { selectedVerificationStatusValue } = this.state;

    return (
      <div className="FileGrid__header">
        <div className="FileGrid__header-left">
          <div className="FileGrid__header-category">{ I18n.t(`FILES.CATEGORY.${verificationType}`) }</div>
          <If condition={verificationType !== 'OTHER'}>
            <div className="FileGrid__header-separator" />
            <div className="FileGrid__header-document-type">{ I18n.t(`FILES.DOCUMENTS_TYPE.${documentType}`) }</div>
          </If>
        </div>
        <If condition={verificationType !== 'OTHER'}>
          <div className="FileGrid__header-right">
            <div className="FileGrid__header-status">
              <span className="FileGrid__header-status-label">{ I18n.t('FILES.CHANGE_VERIFICATION_STATUS') }:</span>
              <Select
                value={selectedVerificationStatusValue || verificationStatus || ''}
                customClassName="FileGrid__header-status-dropdown"
                onChange={(value) => {
                  this.setState({ selectedVerificationStatusValue: value });
                  this.onVerificationStatusChange(value);
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
  }

  renderMoveFileDropdown = ({ uuid, uploadBy }) => {
    const { categories, verificationType, documentType } = this.props;

    return (
      <MoveFileDropDown
        onMoveChange={this.onVerificationTypeChange(uuid)}
        categories={categories}
        uuid={uuid}
        disabled={uploadBy.indexOf('OPERATOR') === -1}
        verificationType={verificationType}
        documentType={documentType}
      />
    );
  }

  renderChangeStatusFile = ({ uuid, status }) => (
    <ChangeFileStatusDropDown
      onChangeStatus={this.onFileStatusChange}
      statusesFile={statusesFile}
      uuid={uuid}
      status={status}
    />
  )

  renderFileName = (data) => {
    const {
      uuid,
      clientUuid,
      title,
      mediaType,
      realName,
      fileName,
      uploadBy,
    } = data;

    const availableToFullScreenFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const isClickable = availableToFullScreenFileTypes.some(fileType => fileType === mediaType);
    const onClick = isClickable ? () => this.onPreviewClick(data) : null;
    const playerPrefix = clientUuid.indexOf('PLAYER') === -1 ? 'PL' : null;
    const uuidPrefix = clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : null;

    return (
      <div className="FileGrid__col FileGrid__col--name">
        <div
          className={classNames('FileGrid__col-title', { 'FileGrid__col-title--clickable': isClickable })}
          onClick={onClick}
        >
          {title}
          <If condition={this.state.previewFileLoadingUuid === uuid}>
            &nbsp;<ShortLoader className="FileGrid__loader" height={15} />
          </If>
        </div>
        <div title={realName} className="FileGrid__col-text">
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

  renderActions = data => (
    <>
      <EditButton onClick={() => this.handleRenameFile(data)} />
      {' '}
      <DownloadButton onClick={() => this.props.onDownloadFileClick(data)} />
      {' '}
      <PermissionContent permissions={permissions.USER_PROFILE.DELETE_FILE}>
        <TrashButton
          onClick={() => this.onDeleteClick(data)}
          disabled={data.uploadBy.indexOf('OPERATOR') === -1}
        />
      </PermissionContent>
    </>
  );

  renderDate = (column, withTime = true) => data => (
    <Choose>
      <When condition={data[column]}>
        <div>
          <div className="FileGrid__col-title">{moment.utc(data[column]).local().format('DD.MM.YYYY')}</div>
          <If condition={withTime}>
            <div className="FileGrid__col-text">{moment.utc(data[column]).local().format('HH:mm:ss')}</div>
          </If>
        </div>
      </When>
      <Otherwise>
        <GridEmptyValue />
      </Otherwise>
    </Choose>
  );

  renderNote = ({ uuid, clientUuid, note }) => (
    <NoteButton
      key={uuid}
      playerUUID={clientUuid}
      targetUUID={uuid}
      targetType={targetTypes.FILE}
      note={note}
    />
  );

  render() {
    const {
      data,
      verificationType,
      verificationStatus,
    } = this.props;

    return (
      <div className={classNames(
        'FileGrid',
        {
          'FileGrid--approved': verificationStatus === 'APPROVED',
          'FileGrid--rejected': verificationStatus === 'REJECTED',
        },
      )}
      >
        {this.renderGridHeader()}

        <Table items={data}>
          <Column
            header={I18n.t('FILES.GRID.COLUMN.NAME')}
            render={this.renderFileName}
          />
          <Column render={this.renderActions} />
          <Column
            header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
            render={this.renderDate('expirationTime', false)}
          />
          <If condition={verificationType !== 'OTHER'}>
            <Column
              header={I18n.t('FILES.MOVE_FILE_TO_VERIFICATION_DOCUMENT_TYPE')}
              render={this.renderMoveFileDropdown}
            />
          </If>
          <Column
            header={I18n.t('FILES.CHANGE_FILE_STATUS')}
            render={this.renderChangeStatusFile}
          />
          <Column
            header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
            render={this.renderDate('uploadDate')}
          />
          <Column
            header={I18n.t('FILES.GRID.COLUMN.NOTE')}
            render={this.renderNote}
          />
        </Table>
      </div>
    );
  }
}

export default compose(
  withImages,
  withModals({
    deleteFileModal: DeleteModal,
    renameFileModal: RenameModal,
  }),
)(FileGrid);
