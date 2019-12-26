import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import I18n from 'i18n-js';
import classNames from 'classnames';
import { shortifyInMiddle } from 'utils/stringFormat';
import { targetTypes } from 'constants/note';
import PermissionContent from 'components/PermissionContent';
import GridView, { GridViewColumn } from 'components/GridView';
import NoteButton from 'components/NoteButton';
import GridEmptyValue from 'components/GridEmptyValue';
import Select from 'components/Select';
import Uuid from 'components/Uuid';
import permissions from 'config/permissions';
import { statusesCategory, statusesFile } from '../constants';
import MoveFileDropDown from './MoveFileDropDown';

class FileGrid extends Component {
  static propTypes = {
    headerClassName: PropTypes.string,
    tableClassName: PropTypes.string,
    dataSource: PropTypes.array.isRequired,
    onStatusActionClick: PropTypes.func.isRequired,
    onDownloadFileClick: PropTypes.func.isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
    onPreviewImageClick: PropTypes.func,
  }

  static defaultProps = {
    headerClassName: null,
    tableClassName: null,
    onPreviewImageClick: null,
  }

  state = {
    selectedVerificationStatusValue: '',
    selectedFileStatusValue: '',
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

  renderMoveFileDropdown = ({ uuid }) => {
    const { categories, verificationType, documentType } = this.props;

    return (
      <MoveFileDropDown
        onMoveChange={this.onVerificationTypeChange(uuid)}
        categories={categories}
        uuid={uuid}
        verificationType={verificationType}
        documentType={documentType}
      />
    );
  }

  renderChangeStatusFile = ({ uuid, status }) => (
    <Select
      value={this.state.selectedFileStatusValue || status}
      customClassName="files-grid__header-status-dropdown filter-row__medium"
      placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
      onChange={(value) => {
        this.setState({ selectedFileStatusValue: value });
        this.onFileStatusChange(value, uuid);
      }}
    >
      {statusesFile.map(({ value, label }) => (
        <option key={`${uuid}-${value}`} value={value}>{I18n.t(label)}</option>
      ))}
    </Select>
  )

  renderFileName = (data) => {
    const isClickable = this.props.onPreviewImageClick;
    const onClick = isClickable
      ? () => this.props.onPreviewImageClick(data)
      : null;
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
          onClick={() => this.props.onDeleteFileClick(data)}
        >
          <i className="fa fa-trash" />
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
        <GridEmptyValue I18n={I18n} />
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
    return (
      <div className="files-grid">
        {this.renderGridHeader()}

        <GridView
          {...this.props}
        >
          <GridViewColumn
            name="fileName"
            header={I18n.t('FILES.GRID.COLUMN.NAME')}
            render={this.renderFileName}
          />
          <GridViewColumn
            name="actions"
            header=""
            headerClassName="width-60"
            render={this.renderActions}
          />
          <GridViewColumn
            name="expirationTime"
            header={I18n.t('FILES.GRID.COLUMN.EXPIRATION_DATE')}
            render={this.renderDate('expirationTime', false)}
          />
          <If condition={this.props.verificationType !== 'OTHER'}>
            <GridViewColumn
              name="status"
              header={I18n.t('FILES.MOVE_FILE_TO_VERIFICATION_DOCUMENT_TYPE')}
              render={this.renderMoveFileDropdown}
            />
          </If>
          <GridViewColumn
            name="statusFile"
            header={I18n.t('FILES.CHANGE_FILE_STATUS')}
            render={this.renderChangeStatusFile}
          />
          <GridViewColumn
            name="date"
            header={I18n.t('FILES.GRID.COLUMN.DATE_TIME')}
            render={this.renderDate('uploadDate')}
          />
          <GridViewColumn
            name="note"
            header={I18n.t('FILES.GRID.COLUMN.NOTE')}
            render={this.renderNote}
          />
        </GridView>
      </div>
    );
  }
}

export default FileGrid;
