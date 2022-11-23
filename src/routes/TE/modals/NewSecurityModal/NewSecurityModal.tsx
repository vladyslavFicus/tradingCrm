import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
import { securityNamePattern } from '../../constants';
import { useCreateSecurityMutation } from './graphql/__generated__/CreateSecurityMutation';

type Props = {
  notify: Notify,
  onCloseModal: () => void,
  onSuccess: () => void,
}

type FormValues = {
  name: string,
  description: string,
}

const NewSecurityModal = (props: Props) => {
  const { onCloseModal, onSuccess, notify } = props;

  const [createSecurity] = useCreateSecurityMutation();

  const handleSubmit = async (variables: FormValues) => {
    try {
      await createSecurity({ variables });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.TITLE'),
        message: error.error === 'error.security.already.exist'
          ? I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NOTIFICATION.FAILED'),
      });
    }
  };
  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        validate={
          createValidator(
            {
              name: ['required', `regex:${securityNamePattern}`],
              description: 'string',
            },
            {
              name: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NAME'),
              description: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.DESCRIPTION'),
            },
            false,
            {
              'regex.name': I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.INVALID_NAME'),
            },
          )
        }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <>
            <ModalHeader
              toggle={onCloseModal}
            >
              {I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.TITLE')}
            </ModalHeader>

            <Form>
              <ModalBody>
                <Field
                  name="name"
                  type="text"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="description"
                  type="text"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.DESCRIPTION')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={onCloseModal}
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  danger
                  disabled={!dirty || isSubmitting}
                  type="submit"
                >
                  {I18n.t('COMMON.BUTTONS.SAVE')}
                </Button>
              </ModalFooter>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(NewSecurityModal);
