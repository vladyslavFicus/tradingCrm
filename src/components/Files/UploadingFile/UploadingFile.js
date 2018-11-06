import React, { Component } from 'react';
import fileSize from 'filesize';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import NoteButton from '../../../components/NoteButton';
import { targetTypes as noteTargetTypes } from '../../../constants/note';
import { categoriesLabels } from '../../../constants/files';
import PropTypes from '../../../constants/propTypes';
import { targetTypes } from '../constants';
import Uuid from '../../../components/Uuid';
import { shortifyInMiddle } from '../../../utils/stringFormat';

class UploadingFile extends Component {
  static propTypes = {
    blockName: PropTypes.string,
    number: PropTypes.number.isRequired,
    data: PropTypes.uploadingFile.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onManageNote: PropTypes.func.isRequired,
    targetType: PropTypes.string,
  };
  static defaultProps = {
    blockName: 'uploading-file',
    targetType: targetTypes.FILES,
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

  handleNoteClick = (target, note, data) => {
    if (note) {
      this.context.onEditNoteClick(target, note, this.getNotePopoverParams());
    } else {
      this.context.onAddNoteClick(data.uuid, noteTargetTypes.FILE)(target, this.getNotePopoverParams());
    }
  };

  handleDeleteFileClick = (e, item) => {
    e.preventDefault();

    this.props.onCancelClick(item);
  };

  renderStatus = (data) => {
    let status = (
      <span className="color-primary">
        {I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADING')} - {data.progress}%
      </span>
    );

    if (!data.uploading) {
      status = !data.error
        ? <span className="color-success">{I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADED')}</span>
        : <span className="color-danger">{I18n.t('FILES.UPLOAD_MODAL.FILE.FAILED')}</span>;
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
      targetType,
    } = this.props;

    return (
      <tr className={blockName}>
        <td className={`${blockName}__row-number`}>{number}.</td>
        <td className={`${blockName}__row-name`}>
          <Field
            name={`${data.id}[name]`}
            component="input"
            type="text"
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE_PLACEHOLDER')}
            className="form-control"
          />
          <div className="font-size-11">
            <div title={data.file.name} className="font-weight-700">
              {shortifyInMiddle(data.file.name, 40)}
            </div>
            <div>
              <Uuid uuid={data.fileUUID} />
            </div>
          </div>
        </td>
        {
          targetType === targetTypes.FILES &&
          <td className={`${blockName}__row-category`}>
            <div className="form-group">
              <Field name={`${data.id}[category]`} component="select" className="form-control">
                <option>{I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY_DEFAULT_OPTION')}</option>
                {Object.keys(categoriesLabels).map(item => (
                  <option key={item} value={item}>{categoriesLabels[item]}</option>
                ))}
              </Field>
            </div>
          </td>
        }
        <td className={`${blockName}__row-status`}>
          {this.renderStatus(data)}
        </td>
        <td className={`${blockName}__row-note`}>
          <NoteButton
            id={`uploading-file-item-note-button-${data.fileId}`}
            note={data.note}
            onClick={this.handleNoteClick}
            targetEntity={data}
          />
        </td>
      </tr>
    );
  }
}

export default UploadingFile;
