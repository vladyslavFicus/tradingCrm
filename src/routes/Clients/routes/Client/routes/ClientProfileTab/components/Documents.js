import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import permissions from 'config/permissions';
import Permissions from 'utils/permissions';
import { shortifyInMiddle } from 'utils/stringFormat';
import PermissionContent from 'components/PermissionContent';
import Grid, { GridColumn } from 'components/Grid';
import StatusDropDown from 'components/FileStatusDropDown';
import FileUpload from 'components/FileUpload';
import Uuid from 'components/Uuid';

const viewFilePermission = new Permissions(permissions.USER_PROFILE.VIEW_FILE);

class Documents extends PureComponent {
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

  handleDownloadFile = (data) => {
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
      <Fragment>
        <button
          type="button"
          className={classNames('btn-transparent-text', { 'cursor-default': !isClickable })}
          onClick={
            isClickable
              ? () => this.props.onDocumentClick(data)
              : null
          }
        >
          {shortifyInMiddle(data.realName, 30)}
        </button>
        {' - '}
        <Uuid uuid={data.uuid} />
        {' '}
        <If condition={canViewFile}>
          <button
            type="button"
            className="fa fa-download btn-transparent"
            onClick={() => this.handleDownloadFile(data)}
          />
        </If>
        <PermissionContent permissions={permissions.USER_PROFILE.DELETE_FILE}>
          <button
            type="button"
            className="fa fa-trash btn-transparent color-danger"
            onClick={e => this.handleDeleteFileClick(e, data)}
          />
        </PermissionContent>
        <small className="d-block">
          {I18n.t('COMMON.AUTHOR_BY')} <Uuid uuid={data.author} />
        </small>
      </Fragment>
    );
  };

  renderDateTime = data => (
    <Fragment>
      <div className="font-weight-700">
        {moment.utc(data.uploadDate).local().format('DD.MM.YYYY')}
      </div>
      <small>at {moment.utc(data.uploadDate).local().format('HH:mm')}</small>
    </Fragment>
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
      <Fragment>
        <If condition={files.length > 0}>
          <PermissionContent permissions={permissions.USER_PROFILE.VIEW_FILES}>
            <Grid
              data={files}
              isLastPage
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
            </Grid>
          </PermissionContent>
        </If>
        <PermissionContent permissions={permissions.USER_PROFILE.UPLOAD_FILE}>
          <div className="text-center">
            <FileUpload
              label={I18n.t('COMMON.ADD_DOCUMENT')}
              onChosen={this.props.onUpload}
              className="btn btn-default-outline"
            />
          </div>
        </PermissionContent>
      </Fragment>
    );
  }
}

export default Documents;
