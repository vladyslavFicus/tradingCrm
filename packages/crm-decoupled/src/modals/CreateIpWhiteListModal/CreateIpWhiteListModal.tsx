import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField } from 'components/Formik';
import Modal from 'components/Modal';
import { useCreateIpWhiteListMutation } from './graphql/__generated__/CreateIpWhiteListMutation';

const validate = Utils.createValidator(
  {
    ip: ['required', 'IP'],
    description: ['required', 'string', 'min:3'],
  },
  {
    ip: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.IP_ADDRESS'),
    description: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.DESCRIPTION'),
  },
  false,
);

type FormValues = {
  ip: string,
  description: string,
};

export type Props = {
  onSuccess: () => void,
  onCloseModal: () => void,
};

const CreateIpWhiteListModal = (props: Props) => {
  const { onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [createIpWhiteListMutation] = useCreateIpWhiteListMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues, formikHelpers: FormikHelpers<FormValues>) => {
    try {
      await createIpWhiteListMutation({ variables: values });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.NOTIFICATIONS.IP_ADDED'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.entity.already.exist') {
        formikHelpers.setFieldError('ip', I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.ERRORS.UNIQUE'));
      } else {
        notify({
          level: LevelType.ERROR,
          title: I18n.t('COMMON.FAIL'),
          message: I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.NOTIFICATIONS.IP_NOT_ADDED'),
        });
      }
    }
  };

  return (
    <Formik
      initialValues={{ ip: '', description: '' }}
      validate={validate}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.TITLE')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
          buttonTitle={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.ADD_BUTTON')}
        >
          <Form>
            <Field
              name="ip"
              data-testid="CreateIpWhiteListModal-ipInput"
              label={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.IP_ADDRESS')}
              component={FormikInputField}
            />

            <Field
              name="description"
              data-testid="CreateIpWhiteListModal-descriptionInput"
              label={I18n.t('IP_WHITELIST.MODALS.ADD_IP_MODAL.DESCRIPTION')}
              component={FormikInputField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(CreateIpWhiteListModal);
