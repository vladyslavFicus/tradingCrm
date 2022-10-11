import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { createValidator } from 'utils/validator';
import { FormikSelectField, FormikTextAreaField } from 'components/Formik';
import { Button } from 'components/UI';
import CoperatoNumbersQuery from './graphql/CoperatoNumbersQuery';
import SendSmsMutation from './graphql/SendSmsMutation';
import './SmsSendModal.scss';

class SmsSendModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['PROFILE', 'LEAD']).isRequired,
    onCloseModal: PropTypes.func.isRequired,
    sendSms: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    coperatoNumbersQuery: PropTypes.query({
      sms: PropTypes.shape({
        coperato: PropTypes.shape({
          numbers: PropTypes.arrayOf(PropTypes.coperatorNumber),
        }),
      }),
    }).isRequired,
  };

  handleSubmit = async (_variables) => {
    const {
      uuid,
      field,
      type,
      sendSms,
      notify,
      onCloseModal,
    } = this.props;

    const variables = {
      ..._variables,
      uuid,
      field,
      type,
    };

    try {
      await sendSms({ variables });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_TO_CLIENT'),
      });

      onCloseModal();
    } catch (e) {
      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('SMS.SMS_SEND_MODAL.SMS_SENT_FAILED'),
      });
    }
  };

  render() {
    const {
      onCloseModal,
      isOpen,
      coperatoNumbersQuery,
    } = this.props;

    const numbers = coperatoNumbersQuery.data?.sms?.coperato?.numbers || [];

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
        className="SmsSendModal"
      >
        <Formik
          initialValues={{}}
          validate={createValidator({
            from: 'required',
            message: 'required',
          }, {
            from: I18n.t('SMS.SMS_SEND_MODAL.FROM_NUMBER'),
            message: I18n.t('SMS.SMS_SEND_MODAL.TEXT_MESSAGE'),
          })}
          onSubmit={this.handleSubmit}
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
  }
}

export default compose(
  withNotifications,
  withRequests({
    coperatoNumbersQuery: CoperatoNumbersQuery,
    sendSms: SendSmsMutation,
  }),
)(SmsSendModal);
