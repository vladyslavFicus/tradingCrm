import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Button } from 'components';
import { Utils } from '@crm/common';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikInputField } from 'components/Formik';
import { securityNamePattern } from '../../constants';
import { useCreateSecurityMutation } from './graphql/__generated__/CreateSecurityMutation';

export type Props = {
  onCloseModal: () => void,
  onSuccess: () => void,
}

type FormValues = {
  name: string,
  description: string,
}

const NewSecurityModal = (props: Props) => {
  const { onCloseModal, onSuccess } = props;

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
          Utils.createValidator(
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
                  data-testid="NewSecurityModal-nameInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="description"
                  type="text"
                  data-testid="NewSecurityModal-descriptionInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.DESCRIPTION')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  data-testid="NewSecurityModal-cancelButton"
                  onClick={onCloseModal}
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  danger
                  disabled={!dirty || isSubmitting}
                  data-testid="NewSecurityModal-saveButton"
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

export default React.memo(NewSecurityModal);
