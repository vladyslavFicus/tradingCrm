import { graphql, compose } from 'react-apollo';
import { reduxForm } from 'redux-form';
import { uploadFileMutation, confirmUploadedFilesMutation } from 'graphql/mutations/files';
import { getFilesCategoriesList } from 'graphql/queries/files';
import { addNoteMutation } from 'graphql/mutations/note';
import { withNotifications } from 'components/HighOrder';
import { createValidator, translateLabels } from 'utils/validator';
import { translatedLabels } from './constants';
import UploadModal from './UploadModal';

const FORM_NAME = 'profileUploadModal';

export default compose(
  withNotifications,
  graphql(addNoteMutation, { name: 'addNote' }),
  graphql(uploadFileMutation, { name: 'uploadFile' }),
  graphql(getFilesCategoriesList, { name: 'getFilesCategoriesList' }),
  graphql(confirmUploadedFilesMutation, { name: 'confirmUploadedFiles' }),
  reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    shouldAsyncValidate: true,
    validate: (data, { registeredFields }) => {
      const rules = {};
      const labels = {};

      if (registeredFields) {
        Object.keys(registeredFields).forEach((fieldKey) => {
          const fileUuid = fieldKey.split('.')[0];

          rules[fileUuid] = {
            title: ['required', 'string'],
            category: ['required', 'string'],
            documentType: ['required', 'string'],
          };

          Object.keys(translatedLabels).forEach((key) => {
            labels[`${fileUuid}.${key}`] = translatedLabels[key];
          });
        });
      }

      return createValidator(rules, translateLabels(labels), false)(data);
    },
  }),
)(UploadModal);
