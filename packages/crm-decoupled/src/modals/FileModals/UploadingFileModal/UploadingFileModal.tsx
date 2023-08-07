import React, { useState } from 'react';
import { filesize } from 'filesize';
import { Field } from 'formik';
import I18n from 'i18n-js';
import { targetTypes } from 'constants/note';
import { EditNote } from 'types/Note';
import { FileCategories } from 'types/fileCategories';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import NoteActionManual from 'components/Note/NoteActionManual';
import Uuid from 'components/Uuid';
import { TrashButton } from 'components';
import { shortifyInMiddle } from 'utils/stringFormat';
import { FileData } from '../constants';
import './UploadingFileModal.scss';

type CustomField = {
  category: string,
  documentType: string,
};

export type Props = {
  number: number,
  fileData: FileData,
  profileUUID: string,
  categories: FileCategories,
  editFileNote: (values: EditNote) => void,
  removeFileNote: (fileUuid: string) => void,
  customFieldChange: (values: CustomField) => void,
  onRemoveFileClick: (fileUuid: string) => void,
};

const UploadingFileModal = (props: Props) => {
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
  } = props;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const documentTypes = selectedCategory ? categories[selectedCategory] : [];

  const renderStatus = (data: FileData) => {
    let status = (
      <span>
        {I18n.t('FILES.UPLOAD_MODAL.FILE.UPLOADING')} - {data.progress}%
      </span>
    );

    if (!data.uploading) {
      status = (
        <Choose>
          <When condition={!data.error}>
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

        <div>{filesize(data?.file?.size)}</div>
      </>
    );
  };

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
        <div title={file?.name as string} className="UploadingFileModal__name">
          {shortifyInMiddle(file?.name as string, 40)}
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
          customOnChange={(value: string) => {
            setSelectedCategory(value);
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
          {documentTypes.map((item: string) => (
            <option key={`${fileUuid}-${item}`} value={item}>
              {item ? I18n.t(`FILES.DOCUMENT_TYPES.${item}`) : item}
            </option>
          ))}
        </Field>
      </td>

      <td className="UploadingFileModal__col UploadingFileModal__status">
        {renderStatus(fileData)}
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
};

export default React.memo(UploadingFileModal);
