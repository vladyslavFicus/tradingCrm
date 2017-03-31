import React, { Component } from 'react';
import fileSize from 'filesize';
import { Field } from 'redux-form';
import NoteButton from '../../../../../../components/NoteButton';
import { targetTypes } from '../../../../../../constants/note';
import { categoriesLabels } from '../../../../../../constants/files';
import PropTypes from '../../../../../../constants/propTypes';

class UploadingFile extends Component {
  static propTypes = {
    blockName: PropTypes.string,
    number: PropTypes.number.isRequired,
    data: PropTypes.uploadingFile.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
  };
  static defaultProps = {
    blockName: 'uploading-file',
  };

  static contextTypes = {
    onAddNoteClick: PropTypes.func.isRequired,
    onEditNoteClick: PropTypes.func.isRequired,
    hidePopover: PropTypes.func.isRequired,
  };

  getNotePopoverParams = () => ({
    placement: 'left',
    onSubmit: this.handleSubmitNote,
    onDelete: this.handleDeleteNote,
  });

  handleSubmitNote = (data) => {
    return new Promise((resolve) => {
      this.props.onManageNote(this.props.data.id, data);
      this.context.hidePopover();
      resolve();
    });
  };

  handleDeleteNote = () => {
    return new Promise((resolve) => {
      this.props.onManageNote(this.props.data.id, null);
      this.context.hidePopover();
      resolve();
    });
  };

  handleNoteClick = (target, data) => {
    if (data.note) {
      this.context.onEditNoteClick(target, data.note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.uuid, targetTypes.FILE)(target, this.getNotePopoverParams());
    }
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
          <Field
            name={`${data.id}[name]`}
            component="input"
            type="text"
            placeholder="File title (required)"
            className="form-control"
          />
          <div className="font-size-11">
            <strong>{data.file.name}</strong> - {data.fileUUID}
          </div>
        </td>
        <td className={`${blockName}__row-category`}>
          <div className="form-group">
            <Field name={`${data.id}[category]`} component="select" className="form-control">
              <option>Choose category</option>
              {Object.keys(categoriesLabels).map(item => (
                <option key={item} value={item}>{categoriesLabels[item]}</option>
              ))}
            </Field>
          </div>
        </td>
        <td className={`${blockName}__row-status`}>
          {this.renderStatus(data)}
        </td>
        <td className={`${blockName}__row-note`}>
          <NoteButton
            id={`uploading-file-item-note-button-${data.fileId}`}
            className="cursor-pointer margin-right-5"
            onClick={id => this.handleNoteClick(id, data)}
          >
            {data.note
              ? <i className="fa fa-sticky-note" />
              : <i className="fa fa-sticky-note-o" />
            }
          </NoteButton>
        </td>
      </tr>
    );
  }
}

export default UploadingFile;
