import React, { Component } from 'react';
import fileSize from 'filesize';
import { Field } from 'redux-form';
import I18n from 'i18n-js';
import { targetTypes } from 'constants/note';
import PropTypes from 'constants/propTypes';
import { InputField, NasSelectField } from 'components/ReduxForm';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import { shortifyInMiddle } from 'utils/stringFormat';

class UploadingFile extends Component {
  static propTypes = {
    number: PropTypes.number.isRequired,
    fileData: PropTypes.uploadingFile.isRequired,
    onRemoveFileClick: PropTypes.func.isRequired,
    profileUUID: PropTypes.string.isRequired,
    categories: PropTypes.shape({
      DOCUMENT_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      ADRESS_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    addFileNote: PropTypes.func.isRequired,
    updateFileNote: PropTypes.func.isRequired,
    removeFileNote: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
  };

  state = {
    selectedCategory: null,
  }

  renderStatus = (fileData) => {
    let status = (
      <span className="color-primary">
        {I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADING')} - {fileData.progress}%
      </span>
    );

    if (!fileData.uploading) {
      status = (
        <Choose>
          <When condition={!fileData.error}>
            <span className="color-success">{I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADED')}</span>
          </When>
          <Otherwise>
            <span className="color-danger">{I18n.t('FILES.UPLOAD_MODAL.FILE.FAILED')}</span>
          </Otherwise>
        </Choose>
      );
    }

    return (
      <>
        <div>{status}</div>
        <div className="color-default font-size-13">({fileSize(fileData.file.size)})</div>
      </>
    );
  };

  render() {
    const {
      fileData,
      fileData: { fileUuid, file, fileNote },
      number,
      categories,
      profileUUID,
      onRemoveFileClick,
      addFileNote,
      updateFileNote,
      removeFileNote,
    } = this.props;

    const { selectedCategory } = this.state;
    const documentTypes = selectedCategory ? categories[selectedCategory] : [''];

    return (
      <tr className="uploading-file" key={fileUuid}>
        <td className="uploading-files__col uploading-files__col-number">{number}.</td>
        <td className="uploading-files__col uploading-files__col-title">
          <Field
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE_PLACEHOLDER')}
            name={`${fileUuid}.title`}
            component={InputField}
            type="text"
          />
        </td>
        <td className="uploading-files__col uploading-files__col-info">
          <div title={file.name} className="uploading-files__file-name">
            {shortifyInMiddle(file.name, 40)}
          </div>
          <div className="uploading-files__file-uuid">
            {fileUuid && <Uuid uuid={fileUuid} />}
          </div>
        </td>
        <td className="uploading-files__col uploading-files__col-category">
          <div className="form-group">
            <Field
              placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY_DEFAULT_OPTION')}
              name={`${fileUuid}.category`}
              component={NasSelectField}
              onChange={(_, value) => {
                this.setState({ selectedCategory: value });
                if (value === 'OTHER') {
                  this.props.change(`${fileUuid}.documentType`, 'OTHER');
                }
              }}
              searchable={false}
              label=""
            >
              {Object.keys(categories).map(item => (
                <option key={`${fileUuid}-${item}`} value={item}>
                  {I18n.t(`FILES.CATEGORIES.${item}`)}
                </option>
              ))}
            </Field>
          </div>
        </td>
        <td className="uploading-files__col uploading-files__col-type">
          <div className="form-group">
            <Field
              placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE_DEFAULT_OPTION')}
              name={`${fileUuid}.documentType`}
              disabled={!selectedCategory || selectedCategory === 'OTHER'}
              component={NasSelectField}
              searchable={false}
              label=""
            >
              {documentTypes.map(item => (
                <option key={`${fileUuid}-${item}`} value={item}>
                  {item ? I18n.t(`FILES.DOCUMENT_TYPES.${item}`) : item}
                </option>
              ))}
            </Field>
          </div>
        </td>
        <td className="uploading-files__col uploading-files__col-status">
          {this.renderStatus(fileData)}
        </td>
        <td className="uploading-files__col uploading-files__col-delete">
          <button
            className="btn-transparent uploading-files__file-delete"
            onClick={() => onRemoveFileClick(fileUuid)}
            type="button"
          >
            <i className="color-danger fa fa-trash" />
          </button>
        </td>
        <td className="uploading-files__col-note">
          {
            fileUuid
            && (
              <NoteButton
                manual
                note={fileNote || null}
                playerUUID={profileUUID}
                targetUUID={fileUuid}
                targetType={targetTypes.FILE}
                onAddSuccess={addFileNote}
                onUpdateSuccess={updateFileNote}
                onDeleteSuccess={() => removeFileNote(fileUuid)}
              />
            )
          }
        </td>
      </tr>
    );
  }
}

export default UploadingFile;
