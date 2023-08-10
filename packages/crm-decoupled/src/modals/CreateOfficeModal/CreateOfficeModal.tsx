import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { Utils, parseErrors, notify, LevelType } from '@crm/common';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
import { useCreateOfficeMutation } from './graphql/__generated__/CreateOfficeMutation';

const attributeLabels = {
  name: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.OFFICE_NAME'),
  country: I18n.t('MODALS.ADD_OFFICE_MODAL.LABELS.COUNTRY'),
};

type FormValues = {
  name: string,
  country: string,
};

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateOfficeModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [createOfficeMutation] = useCreateOfficeMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await createOfficeMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.ADD_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.ADD_OFFICE_MODAL.ERRORS.UNIQUE'));
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
    <Formik
      initialValues={{
        name: '',
        country: '',
      } as FormValues}
      validate={Utils.createValidator(
        {
          name: ['required', 'string'],
          country: ['required', 'string'],
        },
        Utils.translateLabels(attributeLabels),
        false,
      )}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.ADD_OFFICE_MODAL.TITLE')}
          buttonTitle={I18n.t('MODALS.ADD_OFFICE_MODAL.CREATE_BUTTON')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="name"
              data-testid="CreateOfficeModal-nameInput"
              label={attributeLabels.name}
              placeholder={I18n.t('COMMON.NAME')}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="country"
              data-testid="CreateOfficeModal-countrySelect"
              label={attributeLabels.country}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSelectField}
              disabled={isSubmitting}
              searchable
            >
              {Object.keys(Utils.countryList).map(country => (
                <option key={country} value={country}>
                  {Utils.countryList[country]}
                </option>
              ))}
            </Field>
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateOfficeModal);
