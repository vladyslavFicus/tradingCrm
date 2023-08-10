import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, notify, LevelType } from '@crm/common';
import { DocumentFile } from '__generated__/types';
import { FormikInputField } from 'components/Formik';
import Modal from 'components/Modal';
import { useUpdateDocumentMutation } from './graphql/__generated__/UpdateDocumentMutation';

type FormValues = {
  title: string,
  description: string,
};

export type Props = {
  item: DocumentFile,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateDocumentModal = (props: Props) => {
  const { item, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateDocumentMutation] = useUpdateDocumentMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const { title, description } = values;

    try {
      await updateDocumentMutation({ variables: { args: { title, description, uuid: item.uuid } } });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('DOCUMENTS.MODALS.UPDATE.NOTIFICATIONS.DOCUMENT_UPDATED'),
      });
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('DOCUMENTS.MODALS.UPDATE.NOTIFICATIONS.DOCUMENT_NOT_UPDATED'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        title: item.title,
        description: item.description || '',
      }}
      validate={Utils.createValidator(
        {
          title: ['required', 'string', 'max:500'],
          description: ['string', 'max:1000'],
        },
        {
          title: I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.TITLE'),
          description: I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.DESCRIPTION'),
        },
        false,
      )}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, isValid, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('DOCUMENTS.MODALS.UPDATE.TITLE')}
          buttonTitle={I18n.t('DOCUMENTS.MODALS.UPDATE.UPDATE_BUTTON')}
          disabled={!dirty || isSubmitting || !isValid}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="title"
              data-testid="UpdateDocumentModal-titleInput"
              label={`${I18n.t('DOCUMENTS.MODALS.UPDATE.TITLE_FIELD')}`}
              component={FormikInputField}
            />

            <Field
              name="description"
              data-testid="UpdateDocumentModal-descriptionInput"
              label={I18n.t('DOCUMENTS.MODALS.UPDATE.DESCRIPTION')}
              component={FormikInputField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateDocumentModal);
