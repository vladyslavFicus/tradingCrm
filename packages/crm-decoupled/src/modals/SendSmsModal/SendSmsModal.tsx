import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, notify, Types } from '@crm/common';
import { FormikSingleSelectField, FormikTextAreaField } from 'components';
import Modal from 'components/Modal';
import { useFullSmsNumbersQuery } from './graphql/__generated__/FullSmsNumbersQuery';
import { useFullSmsSendMutation } from './graphql/__generated__/FullSmsSendMutation';

type FormValues = {
  from: string,
  message: string,
};

export type Props = {
  uuid: string,
  field: string,
  type: 'PROFILE' | 'LEAD',
  onCloseModal: () => void,
};

const SendSmsModal = (props: Props) => {
  const { uuid, field, type, onCloseModal } = props;

  // ===== Requests ===== //
  const [sendSmsMutation] = useFullSmsSendMutation();

  const fullSmsNumbersQuery = useFullSmsNumbersQuery();

  const numbers = fullSmsNumbersQuery.data?.sms?.fullSms?.numbers || [];

  // ===== Handlers ===== //
  const handleSubmit = async (values: FormValues) => {
    const variables = { ...values, uuid, field, type };

    try {
      await sendSmsMutation({ variables });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_TO_CLIENT'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_FAILED'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        from: '',
        message: '',
      }}
      validate={Utils.createValidator({
        from: 'required',
        message: 'required',
      }, {
        from: I18n.t('SMS.SMS_SEND_MODAL.FROM_NUMBER'),
        message: I18n.t('SMS.SMS_SEND_MODAL.TEXT_MESSAGE'),
      })}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, isValid, submitForm }) => (
        <Modal
          onCloseModal={onCloseModal}
          title={I18n.t('SMS.SMS_SEND_MODAL.TITLE')}
          buttonTitle={I18n.t('COMMON.BUTTONS.SEND')}
          disabled={isSubmitting || !isValid}
          clickSubmit={submitForm}
        >
          <Form>
            <Field
              searchable
              name="from"
              data-testid="SendSmsModal-fromSelect"
              label={I18n.t('SMS.SMS_SEND_MODAL.FROM_NUMBER')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_PHONE_NUMBER')}
              component={FormikSingleSelectField}
              options={numbers.map(({ number, country }) => ({
                label: `[${country}] ${number}`,
                value: number,
              }))}
            />

            <Field
              name="message"
              data-testid="SendSmsModal-messageTextArea"
              label={I18n.t('SMS.SMS_SEND_MODAL.TEXT_MESSAGE')}
              component={FormikTextAreaField}
            />
          </Form>
        </Modal>
      )}
    </Formik>
  );
};

export default React.memo(SendSmsModal);
