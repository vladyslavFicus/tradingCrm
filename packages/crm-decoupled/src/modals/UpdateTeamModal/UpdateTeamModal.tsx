import React from 'react';
import I18n from 'i18n-js';
import { Form, Field, Formik, FormikHelpers } from 'formik';
import { Utils, parseErrors, notify, Types } from '@crm/common';
import { FormikInputField } from 'components/Formik';
import Modal from 'components/Modal';
import { useUpdateTeamMutation } from './graphql/__generated__/UpdateTeamMutation';
import './UpdateTeamModal.scss';

const attributeLabels = {
  teamName: 'MODALS.UPDATE_TEAM_MODAL.LABELS.TEAM_NAME',
};

type DataValues = {
  uuid: string,
  name: string,
};

type FormValues = {
  uuid: string,
  name: string,
};

export type Props = {
  data: DataValues,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTeamModal = (props: Props) => {
  const { data, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateTeamMutation] = useUpdateTeamMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await updateTeamMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TEAM_MODAL.NOTIFICATIONS.SUCCESS'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.branch.name.not-unique') {
        formikHelpers.setFieldError('name', I18n.t('MODALS.UPDATE_TEAM_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: Types.LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('MODALS.UPDATE_TEAM_MODAL.NOTIFICATIONS.ERROR'),
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
          title={I18n.t('MODALS.UPDATE_TEAM_MODAL.HEADER')}
          buttonTitle={I18n.t('MODALS.UPDATE_TEAM_MODAL.UPDATE_BUTTON')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="name"
              data-testid="UpdateTeamModal-nameInput"
              label={I18n.t(attributeLabels.teamName)}
              placeholder={I18n.t('MODALS.UPDATE_TEAM_MODAL.PLACEHOLDERS.TYPE_IN_TEAM_NAME')}
              component={FormikInputField}
              disabled={isSubmitting}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateTeamModal);
