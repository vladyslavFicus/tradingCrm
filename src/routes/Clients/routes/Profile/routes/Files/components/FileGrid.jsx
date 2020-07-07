import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { getApiRoot } from 'config';
import { withRequests } from 'apollo';
import { withModals } from 'hoc';
import PropTypes from 'constants/propTypes';
import { shortifyInMiddle } from 'utils/stringFormat';
import { targetTypes } from 'constants/note';
import PermissionContent from 'components/PermissionContent';
import Grid, { GridColumn } from 'components/Grid';
import NoteButton from 'components/NoteButton';
import GridEmptyValue from 'components/GridEmptyValue';
import Select from 'components/Select';
import Uuid from 'components/Uuid';
import { withImages } from 'components/ImageViewer';
import { DeleteModal } from 'components/Files';
import permissions from 'config/permissions';
import { statusesCategory, statusesFile } from '../constants';
import MoveFileDropDown from './MoveFileDropDown';
import ChangeFileStatusDropDown from './ChangeFileStatusDropDown';
import TokenRefreshMutation from '../graphql/TokenRefreshMutation';

class FileGrid extends PureComponent {
  static propTypes = {
    ...withImages.propTypes,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    categories: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    verificationType: PropTypes.string.isRequired,
    verificationStatus: PropTypes.string.isRequired,
    documentType: PropTypes.string.isRequired,
    handlePageChanged: PropTypes.func.isRequired,
    onStatusActionClick: PropTypes.func.isRequired,
    onVerificationTypeActionClick: PropTypes.func.isRequired,
    onChangeFileStatusActionClick: PropTypes.func.isRequired,
    onDownloadFileClick: PropTypes.func.isRequired,
    modals: PropTypes.shape({
      deleteFileModal: PropTypes.modalType,
    }).isRequired,
  }

  state = {
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

  onPreviewClick = async ({ uuid, clientUuid }) => {
    const { tokenRenew } = this.props;

    try {
      const { data: { auth: { tokenRenew: { token } } } } = await tokenRenew();

      const requestUrl = `${getApiRoot()}/attachments/users/${clientUuid}/files/${uuid}`;

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          'Content-Type': 'application/json',
        },
      });

      const imageUrl = URL.createObjectURL(await response.blob());

      this.props.images.show([{ src: imageUrl }]);
    } catch (e) {
      // Do nothing...
    }
  };

  onDeleteClick = (file) => {
    const { modals: { deleteFileModal } } = this.props;

    deleteFileModal.show({ file });
  };

  renderGridHeader = () => {
    const { verificationStatus, documentType, verificationType } = this.props;
    const { selectedVerificationStatusValue } = this.state;

    return (
      <div className="files-grid__header">
        <div className="files-grid__header-left">
          <div className="files-grid__header-category">{ I18n.t(`FILES.CATEGORY.${verificationType}`) }</div>
          <If condition={verificationType !== 'OTHER'}>
            <div className="files-grid__header-separator" />
            <div className="files-grid__header-document-type">{ I18n.t(`FILES.DOCUMENTS_TYPE.${documentType}`) }</div>
          </If>
        </div>
        <If condition={verificationType !== 'OTHER'}>
          <div className="files-grid__header-right">
            <div className="files-grid__header-status">
              <span className="files-grid__header-status-label">{ I18n.t('FILES.CHANGE_VERIFICATION_STATUS') }:</span>
              <Select
                value={selectedVerificationStatusValue || verificationStatus || ''}
                customClassName="files-grid__header-status-dropdown"
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
    const availableToFullScreenFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const isClickable = availableToFullScreenFileTypes.some(fileType => fileType === data.mediaType);
    const onClick = isClickable ? () => this.onPreviewClick(data) : null;
    const playerPrefix = data.clientUuid.indexOf('PLAYER') === -1 ? 'PL' : null;
    const uuidPrefix = data.clientUuid.indexOf('OPERATOR') === -1 ? playerPrefix : null;

    return (
      <div className="files-grid__col-name">
        <div
          className={classNames('font-weight-700', { 'cursor-pointer': isClickable })}
          onClick={onClick}
        >
          {data.title}
        </div>
        <div title={data.realName} className="font-size-11">
          {data.fileName === data.title ? null : `${shortifyInMiddle(data.fileName, 40)} - `}
          <Uuid uuid={data.uuid} />
        </div>
        <div className="font-size-11">
          {'by '}
          <Uuid
            uuid={data.uploadBy}
            uuidPrefix={uuidPrefix}
          />
        </div>
      </div>
    );
  };

  renderActions = data => (
    <span className="margin-left-5">
      <button type="button" className="btn-transparent" onClick={() => this.props.onDownloadFileClick(data)}>
        <i className="fa fa-download" />
      </button>
      {' '}
      <PermissionContent permissions={permissions.USER_PROFILE.DELETE_FILE}>
        <button
          type="button"
          className="btn-transparent color-danger"
          disabled={data.uploadBy.indexOf('OPERATOR') === -1}
          onClick={() => this.onDeleteClick(data)}
        >
          <i className={
            classNames(
              'fa fa-trash ',
              { 'files-grid__delete-button is-disabled': data.uploadBy.indexOf('OPERATOR') === -1 },
            )
          }
          />
        </button>
      </PermissionContent>
    </span>
  );

  renderDate = (column, withTime = true) => data => (
    <Choose>
      <When condition={data[column]}>
        <div>
          <div className="font-weight-700">{moment.utc(data[column]).local().format('DD.MM.YYYY')}</div>
          <If condition={withTime}>
            <div className="font-size-11">{moment.utc(data[column]).local().format('HH:mm:ss')}</div>
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
    const { data, handlePageChanged } = this.props;

    return (
      <div className="files-grid">
        {this.renderGridHeader()}

        <Grid
          data={data}
          handlePageChanged={handlePageChanged}
        >
          <GridColumn
            name="fileName"
            header={I18n.t('FILES.GRID.COLUMN.NAME')}
            render={this.renderFileName}
          />
          <GridColumn
            name="actions"
            header=""
            headerClassName="width-60"
            render={this.renderActions}
          />
          <GridColumn
            name="expirationTime"
            header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
            render={this.renderDate('expirationTime', false)}
          />
          <If condition={this.props.verificationType !== 'OTHER'}>
            <GridColumn
              name="status"
              header={I18n.t('FILES.MOVE_FILE_TO_VERIFICATION_DOCUMENT_TYPE')}
              render={this.renderMoveFileDropdown}
            />
          </If>
          <GridColumn
            name="statusFile"
            header={I18n.t('FILES.CHANGE_FILE_STATUS')}
            render={this.renderChangeStatusFile}
          />
          <GridColumn
            name="date"
            header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
            render={this.renderDate('uploadDate')}
          />
          <GridColumn
            name="note"
            header={I18n.t('FILES.GRID.COLUMN.NOTE')}
            render={this.renderNote}
          />
        </Grid>
      </div>
    );
  }
}

export default compose(
  withImages,
  withRequests({
    tokenRenew: TokenRefreshMutation,
  }),
  withModals({
    deleteFileModal: DeleteModal,
  }),
)(FileGrid);
