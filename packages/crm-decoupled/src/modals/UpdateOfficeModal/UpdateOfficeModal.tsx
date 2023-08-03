import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { parseErrors } from 'apollo';
import countryList from 'utils/countryList';
import { createValidator, translateLabels } from 'utils/validator';
import { HierarchyBranch } from '__generated__/types';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import Modal from 'components/Modal';
import { notify, LevelType } from 'providers/NotificationProvider';
import { useUpdateOfficeMutation } from './graphql/__generated__/UpdateOfficeMutation';
import { attributeLabels } from './constants';

type FormValues = {
  uuid: string,
  name: string,
  country: string,
};

export type Props = {
  data: HierarchyBranch,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateOfficeModal = (props: Props) => {
  const { data, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateOfficeMutation] = useUpdateOfficeMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await updateOfficeMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.UPDATE_OFFICE_MODAL.ERRORS.UNIQUE'));
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
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.UPDATE_OFFICE_MODAL.TITLE')}
          buttonTitle={I18n.t('MODALS.UPDATE_OFFICE_MODAL.CREATE_BUTTON')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="name"
              data-testid="UpdateOfficeModal-nameInput"
              label={attributeLabels.name}
              placeholder={I18n.t('COMMON.NAME')}
              component={FormikInputField}
              disabled={isSubmitting}
            />

            <Field
              name="country"
              data-testid="UpdateOfficeModal-countrySelect"
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
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateOfficeModal);
