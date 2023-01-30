import React, { PureComponent } from 'react';
import fileSize from 'filesize';
import { Field } from 'formik';
import I18n from 'i18n-js';
import { targetTypes } from 'constants/note';
import PropTypes from 'constants/propTypes';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import NoteActionManual from 'components/Note/NoteActionManual';
import Uuid from 'components/Uuid';
import { TrashButton } from 'components/UI';
import { shortifyInMiddle } from 'utils/stringFormat';
import './UploadingFileModal.scss';

class UploadingFileModal extends PureComponent {
  static propTypes = {
    number: PropTypes.number.isRequired,
    fileData: PropTypes.uploadingFile.isRequired,
    onRemoveFileClick: PropTypes.func.isRequired,
    profileUUID: PropTypes.string.isRequired,
    categories: PropTypes.shape({
      DOCUMENT_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
      ADRESS_VERIFICATION: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    editFileNote: PropTypes.func.isRequired,
    removeFileNote: PropTypes.func.isRequired,
    customFieldChange: PropTypes.func.isRequired,
  };

  state = {
    selectedCategory: null,
  }

  renderStatus = (fileData) => {
    let status = (
      <span>
        {I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADING')} - {fileData.progress}%
      </span>
    );

    if (!fileData.uploading) {
      status = (
        <Choose>
          <When condition={!fileData.error}>
            <span className="UploadingFileModal__status--success">{I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADED')}</span>
          </When>
          <Otherwise>
            <span className="UploadingFileModal__status--error">{I18n.t('FILES.UPLOAD_MODAL.FILE.FAILED')}</span>
          </Otherwise>
        </Choose>
      );
    }

    return (
      <>
        <div>{status}</div>
        <div>({fileSize(fileData.file.size)})</div>
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
      editFileNote,
      removeFileNote,
      customFieldChange,
    } = this.props;

    const { selectedCategory } = this.state;
    const documentTypes = selectedCategory ? categories[selectedCategory] : [''];

    return (
      <tr className="UploadingFileModal" key={fileUuid}>
        <td className="UploadingFileModal__col UploadingFileModal__number">{number}.</td>
        <td className="UploadingFileModal__col UploadingFileModal__title">
          <Field
            placeholder={I18n.t('FILES.UPLOAD_MODAL.FILE.TITLE_PLACEHOLDER')}
            name={`${fileUuid}.title`}
            component={FormikInputField}
            type="text"
          />
        </td>
        <td className="UploadingFileModal__col UploadingFileModal__info">
          <div title={file.name} className="UploadingFileModal__name">
            {shortifyInMiddle(file.name, 40)}
          </div>
          <div className="UploadingFileModal__uuid">
            {fileUuid && <Uuid uuid={fileUuid} />}
          </div>
        </td>
        <td className="UploadingFileModal__col UploadingFileModal__category">
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
        <td className="UploadingFileModal__col UploadingFileModal__type">
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
        <td className="UploadingFileModal__col UploadingFileModal__status">
          {this.renderStatus(fileData)}
        </td>
        <td className="UploadingFileModal__col">
          <TrashButton
            className="UploadingFileModal__removeButton"
            onClick={() => onRemoveFileClick(fileUuid)}
          />
        </td>
        <td className="UploadingFileModal__note">
          {
            fileUuid
            && (
              <NoteActionManual
                note={fileNote || null}
                playerUUID={profileUUID}
                targetUUID={fileUuid}
                targetType={targetTypes.FILE}
                onEditSuccess={editFileNote}
                onDeleteSuccess={() => removeFileNote(fileUuid)}
              />
            )
          }
        </td>
      </tr>
    );
  }
}

export default UploadingFileModal;
