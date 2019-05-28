import React, { Component } from 'react';
import fileSize from 'filesize';
import { Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import { InputField, NasSelectField } from '../../../components/ReduxForm';
import NoteButton from '../../../components/NoteButton';
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
    targetType: PropTypes.string,
    playerUUID: PropTypes.string.isRequired,
  };

  static defaultProps = {
    blockName: 'uploading-file',
    targetType: targetTypes.FILES,
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
      playerUUID,
    } = this.props;

    return (
      <tr className={blockName}>
        <td className={`${blockName}__row-number`}>{number}.</td>
        <td className={`${blockName}__row-name`}>
          <Field
            name={`${data.id}.name`}
            component={InputField}
            type="text"
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE_PLACEHOLDER')}
          />
          <div className="font-size-11">
            <div title={data.file.name} className="font-weight-700">
              {shortifyInMiddle(data.file.name, 40)}
            </div>
            <div>
              {data.fileUUID && <Uuid uuid={data.fileUUID} />}
            </div>
          </div>
        </td>
        {
          targetType === targetTypes.FILES &&
          <td className={`${blockName}__row-category`}>
            <div className="form-group">
              <Field
                name={`${data.id}.category`}
                component={NasSelectField}
                searchable={false}
                label=""
                placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY_DEFAULT_OPTION')}
              >
                {Object.keys(categoriesLabels).map(item => (
                  <option key={item} value={item}>{I18n.t(categoriesLabels[item])}</option>
                ))}
              </Field>
            </div>
          </td>
        }
        <td className={`${blockName}__row-status`}>
          {this.renderStatus(data)}
        </td>
        <td className={`${blockName}__row-note`}>
          {
            data.fileUUID &&
            <NoteButton
              playerUUID={playerUUID}
              targetUUID={data.fileUUID}
              onAddSuccess={this.handleSubmitNote}
              onUpdateSuccess={this.handleSubmitNote}
              onDeleteSuccess={this.handleDeleteNote}
            />
          }
        </td>
      </tr>
    );
  }
}

export default UploadingFile;
