import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import I18n from 'i18n-js';
import { Utils, parseErrors, notify, Types } from '@crm/common';
import { HierarchyBranch } from '__generated__/types';
import { FormikInputField, FormikSingleSelectField } from 'components';
import Modal from 'components/Modal';
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
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.UPDATE_OFFICE_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_OFFICE_MODAL.NOTIFICATION.ERROR'),
        });
      }
    }
  };
  return (
    <Formik
      initialValues={data as FormValues}
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
              searchable
              name="country"
              data-testid="UpdateOfficeModal-countrySelect"
              label={attributeLabels.country}
              placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
              component={FormikSingleSelectField}
              disabled={isSubmitting}
              options={Object.keys(Utils.countryList).map(country => ({
                label: Utils.countryList[country],
                value: country,
              }))}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateOfficeModal);
