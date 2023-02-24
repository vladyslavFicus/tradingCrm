import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { Button } from 'components/Buttons';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { useUpdateDocumentMutation } from './graphql/__generated__/UpdateDocumentMutation';
import './UpdateDoсumentModal.scss';

const validate = createValidator(
  {
    title: ['required', 'string', 'max:500'],
    description: ['string', 'max:1000'],
  },
  {
    title: I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.TITLE'),
    description: I18n.t('DOCUMENTS.MODALS.ADD_DOCUMENT.DESCRIPTION'),
  },
  false,
);

type FormValues = {
  title: string,
  uuid: string,
  description: string | null,
};

export type Props = {
  item: FormValues | null,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateDocumentModal = (props: Props) => {
  const { item, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateDocumentMutation] = useUpdateDocumentMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const { title, description, uuid } = values;

    try {
      await updateDocumentMutation({ variables: { args: { title, description, uuid } } });

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
    <Modal className="UpdateDoсumentModal" toggle={onCloseModal} isOpen>
      <Formik
        initialValues={item || {
          title: '',
          description: '',
        } as FormValues}
        validate={validate}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, isValid }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('DOCUMENTS.MODALS.UPDATE.TITLE')}
            </ModalHeader>

            <ModalBody>
              <Field
                name="title"
                label={`${I18n.t('DOCUMENTS.MODALS.UPDATE.TITLE_FIELD')}`}
                component={FormikInputField}
              />

              <Field
                name="description"
                label={I18n.t('DOCUMENTS.MODALS.UPDATE.DESCRIPTION')}
                component={FormikInputField}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                onClick={onCloseModal}
                className="UpdateDoсumentModal__button"
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>

              <Button
                className="UpdateDoсumentModal__button"
                primary
                disabled={!dirty || isSubmitting || !isValid}
                type="submit"
              >
                {I18n.t('DOCUMENTS.MODALS.UPDATE.UPDATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(UpdateDocumentModal);
