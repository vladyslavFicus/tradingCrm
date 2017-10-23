import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../../../../constants/propTypes';
import FileUpload from '../../../../../components/FileUpload';
import GridView, { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import { shortifyInMiddle } from '../../../../../utils/stringFormat';
import StatusDropDown from '../../../../../components/FileStatusDropDown';
import PermissionContent from '../../../../../components/PermissionContent';
import permissions from '../../../../../config/permissions';
import Permissions from '../../../../../utils/permissions';
import Uuid from '../../../../../components/Uuid';

const viewFilePermission = new Permissions(permissions.USER_PROFILE.VIEW_FILE);

class Documents extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
    onUpload: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired,
    onDocumentClick: PropTypes.func,
  };
  static defaultProps = {
    onDocumentClick: null,
  };
  static contextTypes = {
    permissions: PropTypes.arrayOf(PropTypes.string).isRequired,
    onDeleteFileClick: PropTypes.func.isRequired,
  };

  handleStatusChange = uuid => (action) => {
    this.props.onChangeStatus(uuid, action);
  };

  handleDownloadFile = (e, data) => {
    e.preventDefault();

    this.props.onDownload(data);
  };

  handleDeleteFileClick = (e, data) => {
    this.context.onDeleteFileClick(e, data);
  };

  renderFile = (data, canViewFile) => {
    const isClickable = /image/.test(data.type)
      && this.props.onDocumentClick
      && canViewFile;

    return (
      <div>
        <div>
          <span
            title={data.realName}
            className={classNames('font-weight-700', { 'cursor-pointer': isClickable })}
            onClick={
              isClickable
                ? () => this.props.onDocumentClick(data)
                : null
            }
          >
            {shortifyInMiddle(data.realName, 30)}
          </span>
          {' - '}
          <Uuid uuid={data.uuid} />
          {' '}
          {
            canViewFile &&
            <button className="btn-transparent" onClick={e => this.handleDownloadFile(e, data)}>
              <i className="fa fa-download" />
            </button>
          }
          <PermissionContent permissions={permissions.USER_PROFILE.DELETE_FILE}>
            <button className="btn-transparent color-danger" onClick={e => this.handleDeleteFileClick(e, data)}>
              <i className="fa fa-trash" />
            </button>
          </PermissionContent>
        </div>
        <span className="font-size-10 color-default">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.author} />
        </span>
      </div>
    );
  };

  renderDateTime = data => (
    <div>
      <div className="font-weight-700">
        {moment.utc(data.uploadDate).local().format('DD.MM.YYYY')}
      </div>
      <span className="font-size-10 color-default">
        at {moment.utc(data.uploadDate).local().format('HH:mm')}
      </span>
    </div>
  );

  renderStatus = data => (
    <StatusDropDown
      status={data.status}
      onStatusChange={this.handleStatusChange(data.uuid)}
    />
  );

  render() {
    const { files } = this.props;
    const canViewFile = viewFilePermission.check(this.context.permissions);

    return (
      <div>
        {
          files.length > 0 &&
          <PermissionContent permissions={permissions.USER_PROFILE.VIEW_FILES}>
            <GridView
              tableClassName="table"
              headerClassName="text-uppercase"
              dataSource={files}
              totalPages={0}
            >
              <GridColumn
                name="realName"
                header="File"
                render={data => this.renderFile(data, canViewFile)}
              />
              <GridColumn
                name="uploadDate"
                header="Date & Time"
                render={this.renderDateTime}
              />
              <GridColumn
                name="status"
                header="Status"
                render={this.renderStatus}
              />
            </GridView>
          </PermissionContent>
        }

        <PermissionContent permissions={permissions.USER_PROFILE.UPLOAD_FILE}>
          <div className="text-center">
            <FileUpload
              label="+ Add document"
              onChosen={this.props.onUpload}
              className="btn btn-default-outline"
            />
          </div>
        </PermissionContent>
      </div>
    );
  }
}

export default Documents;
