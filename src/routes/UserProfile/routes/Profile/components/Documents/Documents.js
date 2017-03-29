import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from '../../../../../../constants/propTypes';
import FileUpload from '../../../../../../components/FileUpload';
import GridView, { GridColumn } from '../../../../../../components/GridView';
import { shortify } from '../../../../../../utils/uuid';
import StatusDropDown from './StatusDropDown';

class Documents extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.fileEntity).isRequired,
    onUpload: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onChangeStatus: PropTypes.func.isRequired,
  };

  handleStatusChange = uuid => (action) => {
    this.props.onChangeStatus(uuid, action);
  };

  handleDownloadFile = (e, data) => {
    e.preventDefault();

    this.props.onDownload(data);
  };

  renderFile = data => (
    <div>
      <div>
        <span className="font-weight-700">
          {data.realName}
        </span>
        {' - '}
        <span>{shortify(data.uuid)}</span>
        {' '}
        <button className="btn-transparent" onClick={e => this.handleDownloadFile(e, data)}>
          <i className="fa fa-download" />
        </button>
      </div>
      <span className="font-size-10 color-default">
        by {shortify(data.author)}
      </span>
    </div>
  );

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
      <div className="player__account__page__kyc-document--list">
        {
          files.length > 0 &&
          <GridView
            tableClassName="table table-hovered documents-table"
            headerClassName=""
            dataSource={files}
            totalPages={0}
          >
            <GridColumn
              name="realName"
              header="File"
              headerClassName="text-uppercase width-300"
              render={this.renderFile}
            />
            <GridColumn
              name="uploadDate"
              header="Date & Time"
              headerClassName="text-uppercase"
              render={this.renderDateTime}
            />
            <GridColumn
              name="status"
              header="Status"
              headerClassName="text-uppercase"
              render={this.renderStatus}
            />
          </GridView>
        }

        <div className="text-center">
          <FileUpload
            label="+ Add document"
            onChosen={this.props.onUpload}
            className="player__account__page__kyc-document-add btn btn-default-outline"
          />
        </div>
      </div>
    );
  }
}

export default Documents;
