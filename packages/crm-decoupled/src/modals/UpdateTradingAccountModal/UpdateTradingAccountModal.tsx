import React from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { Utils, notify, Types } from '@crm/common';
import { FormikInputField } from 'components';
import Modal from 'components/Modal';
import { useUpdateTradingAccountMutation } from './graphql/__generated__/UpdateTradingAccountMutation';

const attributeLabels = {
  name: 'MODALS.UPDATE_TRADING_ACCOUNT_MODAL.LABLES.NAME',
};

type FormValues = {
  name: string,
};

export type Props = {
  accountUUID: string,
  name: string,
  onSuccess: () => void,
  onCloseModal: () => void,
};

const UpdateTradingAccountModal = (props: Props) => {
  const { accountUUID, name, onSuccess, onCloseModal } = props;

  // ===== Requests ===== //
  const [updateTradingAccountMutation] = useUpdateTradingAccountMutation();

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await updateTradingAccountMutation({ variables: { ...values, accountUUID } });

      onSuccess();
      onCloseModal();

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.ERROR'),
      });
    }
  };

  return (
    <Formik
      initialValues={{ name }}
      validate={Utils.createValidator({
        name: ['required', 'string'],
      }, Utils.translateLabels(attributeLabels), false)}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.TITLE')}
          buttonTitle={I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.UPDATE_BUTTON')}
          disabled={isSubmitting}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              name="name"
              data-testid="UpdateTradingAccountModal-nameInput"
              label={I18n.t(attributeLabels.name)}
              placeholder={I18n.t('COMMON.NAME')}
              component={FormikInputField}
              disabled={isSubmitting}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(UpdateTradingAccountModal);
