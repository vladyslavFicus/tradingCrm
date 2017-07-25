import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from '../../../../../constants/propTypes';
import FileUpload from '../../../../../components/FileUpload';
import GridView, { GridColumn } from '../../../../../components/GridView';
import { shortify } from '../../../../../utils/uuid';
import { shortifyInMiddle } from '../../../../../utils/stringFormat';
import StatusDropDown from '../../../../../components/FileStatusDropDown';

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

  renderFile = (data) => {
    const isClickable = /image/.test(data.type) && this.props.onDocumentClick;

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
          <span>{shortify(data.uuid)}</span>
          {' '}
          <button className="btn-transparent" onClick={e => this.handleDownloadFile(e, data)}>
            <i className="fa fa-download" />
          </button>
          <button className="btn-transparent color-danger" onClick={e => this.handleDeleteFileClick(e, data)}>
            <i className="fa fa-trash" />
          </button>
        </div>
        <span className="font-size-10 color-default">
        by {shortify(data.author)}
        </span>
      </div>
    );
  };

  renderDateTime = data => (
    <div>
      <div className="font-weight-700">
        {moment(data.uploadDate).format('DD.MM.YYYY')}
      </div>
      <span className="font-size-10 color-default">
        at {moment(data.uploadDate).format('HH:mm')}
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

    return (
      <div>
        {
          files.length > 0 &&
          <GridView
            tableClassName="table"
            headerClassName="text-uppercase"
            dataSource={files}
            totalPages={0}
          >
            <GridColumn
              name="realName"
              header="File"
              render={this.renderFile}
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
        }

        <div className="text-center">
          <FileUpload
            label="+ Add document"
            onChosen={this.props.onUpload}
            className="btn btn-default-outline"
          />
        </div>
      </div>
    );
  }
}

export default Documents;
