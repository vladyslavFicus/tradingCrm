import React, { PureComponent } from 'react';
import fileSize from 'filesize';
import { Field } from 'formik';
import I18n from 'i18n-js';
import { targetTypes } from 'constants/note';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import NoteButton from 'components/NoteButton';
import Uuid from 'components/Uuid';
import { Button } from 'components/UI';
import { shortifyInMiddle } from 'utils/stringFormat';
import './UploadingFile.scss';

class UploadingFile extends PureComponent {
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
    customFieldChange: PropTypes.func.isRequired,
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
      customFieldChange,
    } = this.props;

    const { selectedCategory } = this.state;
    const documentTypes = selectedCategory ? categories[selectedCategory] : [''];

    return (
      <tr className="UploadingFile" key={fileUuid}>
        <td className="UploadingFile__col UploadingFile__number">{number}.</td>
        <td className="UploadingFile__col UploadingFile__title">
          <Field
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE_PLACEHOLDER')}
            name={`${fileUuid}.title`}
            component={FormikInputField}
            type="text"
          />
        </td>
        <td className="UploadingFile__col UploadingFile__info">
          <div title={file.name} className="UploadingFile__name">
            {shortifyInMiddle(file.name, 40)}
          </div>
          <div className="UploadingFile__uuid">
            {fileUuid && <Uuid uuid={fileUuid} />}
          </div>
        </td>
        <td className="UploadingFile__col UploadingFile__category">
          <Field
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.CATEGORY_DEFAULT_OPTION')}
            name={`${fileUuid}.category`}
            component={FormikSelectField}
            customOnChange={(value) => {
              this.setState({ selectedCategory: value });
              customFieldChange({
                category: value,
                documentType: value === 'OTHER' ? 'OTHER' : '',
              });
            }}
          >
            {Object.keys(categories).map(item => (
              <option key={`${fileUuid}-${item}`} value={item}>
                {I18n.t(`FILES.CATEGORIES.${item}`)}
              </option>
            ))}
          </Field>
        </td>
        <td className="UploadingFile__col UploadingFile__type">
          <Field
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.DOCUMENT_TYPE_DEFAULT_OPTION')}
            name={`${fileUuid}.documentType`}
            disabled={!selectedCategory || selectedCategory === 'OTHER'}
            component={FormikSelectField}
          >
            {documentTypes.map(item => (
              <option key={`${fileUuid}-${item}`} value={item}>
                {item ? I18n.t(`FILES.DOCUMENT_TYPES.${item}`) : item}
              </option>
            ))}
          </Field>
        </td>
        <td className="UploadingFile__col UploadingFile__status">
          {this.renderStatus(fileData)}
        </td>
        <td className="UploadingFile__col">
          <Button
            transparent
            className="UploadingFile__removeButton"
            onClick={() => onRemoveFileClick(fileUuid)}
          >
            <i className="color-danger fa fa-trash" />
          </Button>
        </td>
        <td className="UploadingFile__note">
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
