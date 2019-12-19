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
  }

  onVerificationStatusChange = (value) => {
    const { verificationType, documentType } = this.props;

    this.props.onStatusActionClick(verificationType, documentType, value);
  }

  onVerificationTypeChange = uuid => ({ verificationType, documentType }) => {
    this.props.onVerificationTypeActionClick(uuid, verificationType, documentType);
  }

  renderGridHeader = () => {
    const { verificationStatus, documentType, verificationType } = this.props;
    const { selectedVerificationStatusValue } = this.state;

    const options = [
      {
        value: 'APPROVED',
        label: I18n.t('FILES.STATUSES.APPROVED'),
      },
      {
        value: 'REJECTED',
        label: I18n.t('FILES.STATUSES.REJECTED'),
      },
      {
        value: 'PENDING',
        label: I18n.t('FILES.STATUSES.PENDING'),
      },
    ];

    return (
      <div className="files-grid__header">
        <div className="files-grid__header-left">
          <div className="files-grid__header-category">{ I18n.t(`FILES.CATEGORY.${verificationType}`) }</div>
          <div className="files-grid__header-separator" />
          <div className="files-grid__header-document-type">{ I18n.t(`FILES.DOCUMENTS_TYPE.${documentType}`) }</div>
        </div>
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
              {options.map(({ value, label }) => (
                <option key={`${verificationType}-${documentType}-${value}`} value={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
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

  renderNote = data => (
    <NoteButton
      key={data.uuid}
      playerUUID={data.clientUuid}
      targetUUID={data.uuid}
      targetType={targetTypes.FILE}
      note={data.note}
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
          <GridViewColumn
            name="status"
            header={I18n.t('FILES.MOVE_FILE_TO_VERIFICATION_DOCUMENT_TYPE')}
            render={this.renderMoveFileDropdown}
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
