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
import { useUpdateOfficeMutation } from './graphql/__generated__/UpdateOfficeMutation';
import './UpdateOfficeModal.scss';

const attributeLabels = {
  name: I18n.t('MODALS.UPDATE_OFFICE_MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('MODALS.UPDATE_OFFICE_MODAL.LABELS.COUNTRY'),
};

type FormValues = {
  uuid: string,
  name: string,
  country: string,
}

type DataValues = {
  uuid: string,
  name: string,
  country: string,
}

type Props = {
  data: DataValues,
  isOpen: boolean,
  notify: Notify,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateOfficeModal = (props: Props) => {
  const { data, isOpen, notify, onSuccess, onCloseModal } = props;
  const [updateOfficeMutation] = useUpdateOfficeMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>,
  ) => {
    try {
      await updateOfficeMutation({ variables: values });
      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);
      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError(
          'name',
          I18n.t('MODALS.UPDATE_OFFICE_MODAL.ERRORS.UNIQUE'),
        );
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.ERROR'),
        });
      }
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={onCloseModal}
    >
      <Formik
        initialValues={data as FormValues}
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
              {I18n.t('MODALS.UPDATE_OFFICE_MODAL.TITLE')}
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
                className="UpdateOfficeModal__button"
                onClick={onCloseModal}
                tertiary
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                className="UpdateOfficeModal__button"
                disabled={isSubmitting}
                type="submit"
                primary
              >
                {I18n.t('MODALS.UPDATE_OFFICE_MODAL.CREATE_BUTTON')}
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
)(UpdateOfficeModal);
