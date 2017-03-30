import React, { Component } from 'react';
import fileSize from 'filesize';
import PropTypes from '../../../../../../constants/propTypes';

class UploadingFile extends Component {
  static propTypes = {
    blockName: PropTypes.string,
    number: PropTypes.number.isRequired,
    data: PropTypes.uploadingFile.isRequired,
    onCancelClick: PropTypes.func.isRequired,
  };
  static defaultProps = {
    blockName: 'uploading-file',
  };

  handleDeleteFileClick = (e, item) => {
    e.preventDefault();

    this.props.onCancelClick(item);
  };

  renderStatus = (data) => {
    let status = <span className="color-primary">Uploading - {data.progress}%</span>;

    if (!data.uploading) {
      status = !data.error
        ? <span className="color-success">Uploaded</span>
        : <span className="color-danger">Failed</span>;
    }

    return (
      <span>
        {status}
        {' '}
        <span className="color-default">
          ({fileSize(data.file.size)})
        </span>
        {' '}
        <button className="btn-transparent" onClick={e => this.handleDeleteFileClick(e, data)}>
          <i className="color-danger fa fa-trash" />
        </button>
      </span>
    );
  };

  render() {
    const {
      blockName,
      number,
      data,
    } = this.props;

    return (
      <tr className={blockName}>
        <td className={`${blockName}__row-number`}>{number}.</td>
        <td className={`${blockName}__row-name`}>

            <input type="text" placeholder="File title" className="form-control" />

          <div className="font-size-11">
            <strong>{data.file.name}</strong> - {data.fileUUID}
          </div>
        </td>
        <td className={`${blockName}__row-category`}>
          <div className="form-group">
            <select className="form-control">
              <option>Select</option>
              <option>Select</option>
              <option>Select</option>
              <option>Select</option>
            </select>
          </div>
        </td>
        <td className={`${blockName}__row-status`}>
          {this.renderStatus(data)}
        </td>
        <td className={`${blockName}__row-note`}>
          <i className="fa fa-sticky-note" />
        </td>
      </tr>
    );
  }
}

export default UploadingFile;
