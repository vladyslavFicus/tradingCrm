import React from 'react';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
import { useCreateOfficeMutation } from './graphql/__generated__/CreateOfficeMutation';
import './CreateOfficeModal.scss';

const attributeLabels = {
  name: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.COUNTRY'),
};

type FormValues = {
  name: string,
  country: string,
}

type Props = {
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateOfficeModal = (props: Props) => {
  const { isOpen, notify, onSuccess, onCloseModal } = props;
  const [createOfficeMutation] = useCreateOfficeMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await createOfficeMutation({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'name',
          I18n.t('MODALS.ADD_OFFICE_MODAL.ERRORS.UNIQUE'),
        );
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.ERROR'),
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onCloseModal}>
      <Formik
        initialValues={{
          name: '',
          country: '',
        } as FormValues}
        validate={createValidator(
          {
            name: ['required', 'string'],
            country: ['required', 'string'],
          },
          translateLabels(attributeLabels),
          false,
        )}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('MODALS.ADD_OFFICE_MODAL.TITLE')}
            </ModalHeader>
            <ModalBody>
              <Field
                name="name"
                label={attributeLabels.name}
                placeholder={I18n.t('COMMON.NAME')}
                component={FormikInputField}
                disabled={isSubmitting}
              />
              <Field
                name="country"
                label={attributeLabels.country}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                component={FormikSelectField}
                disabled={isSubmitting}
                searchable
              >
                {Object.keys(countryList).map(country => (
                  <option key={country} value={country}>
                    {countryList[country]}
                  </option>
                ))}
              </Field>
            </ModalBody>
            <ModalFooter>
              <Button
                className="CreateOfficeModal__button"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                className="CreateOfficeModal__button"
                disabled={isSubmitting}
                type="submit"
                primary
              >
                {I18n.t('MODALS.ADD_OFFICE_MODAL.CREATE_BUTTON')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(CreateOfficeModal);
