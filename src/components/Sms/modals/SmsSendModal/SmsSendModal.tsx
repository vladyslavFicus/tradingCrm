import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator } from 'utils/validator';
import { FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { useFullSmsNumbersQuery } from './graphql/__generated__/FullSmsNumbersQuery';
import { useFullSmsSendMutation } from './graphql/__generated__/FullSmsSendMutation';
import './SmsSendModal.scss';

export type Props = {
  uuid: string,
  field: string,
  type: 'PROFILE' | 'LEAD',
  onCloseModal: () => void,
}

type FormValues = {
  from: string,
  message: string,
}

const SmsSendModal = (props: Props) => {
  const {
    uuid,
    field,
    type,
    onCloseModal,
  } = props;
  const [sendSmsMutation] = useFullSmsSendMutation();
  const fullSmsNumbersQuery = useFullSmsNumbersQuery();
  const numbers = fullSmsNumbersQuery.data?.sms?.fullSms?.numbers || [];

  const handleSubmit = async (_variables: FormValues) => {
    const variables = {
      ..._variables,
      uuid,
      field,
      type,
    };

    try {
      await sendSmsMutation({ variables });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_TO_CLIENT'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_FAILED'),
      });
    }
  };

  return (
    <Modal
      toggle={onCloseModal}
      isOpen
      className="SmsSendModal"
    >
      <Formik
        initialValues={{
          from: '',
          message: '',
        }}
        validate={createValidator({
          from: 'required',
          message: 'required',
        }, {
          from: I18n.t('SMS.SMS_SEND_MODAL.FROM_NUMBER'),
          message: I18n.t('SMS.SMS_SEND_MODAL.TEXT_MESSAGE'),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, isValid }) => (
          <Form>
            <ModalHeader toggle={onCloseModal}>
              {I18n.t('SMS.SMS_SEND_MODAL.TITLE')}
            </ModalHeader>
            <ModalBody>
              <Field
                searchable
                name="from"
                label={I18n.t('SMS.SMS_SEND_MODAL.FROM_NUMBER')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.SELECT_PHONE_NUMBER')}
                component={FormikSelectField}
              >
                {numbers.map(({ number, country }) => (
                  <option key={number} value={number}>
                    {`[${country}] ${number}`}
                  </option>
                ))}
              </Field>
              <Field
                name="message"
                label={I18n.t('SMS.SMS_SEND_MODAL.TEXT_MESSAGE')}
                component={FormikTextAreaField}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                tertiary
                onClick={onCloseModal}
              >
                {I18n.t('COMMON.BUTTONS.CANCEL')}
              </Button>
              <Button
                type="submit"
                primary
                disabled={isSubmitting || !isValid}
              >
                {I18n.t('COMMON.BUTTONS.SEND')}
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default React.memo(SmsSendModal);
