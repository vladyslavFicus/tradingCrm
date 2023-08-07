import React from 'react';
import I18n from 'i18n-js';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Field, Form, Formik } from 'formik';
import { Button } from 'components';
import { parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { securityNamePattern } from '../../constants';
import { useSecurityQuery } from './graphql/__generated__/SecurityQuery';
import { useEditSecurityMutation } from './graphql/__generated__/EditSecurityMutation';

export type Props = {
  onCloseModal: () => void,
  onSuccess: () => void,
  name: string,
}

type FormValues = {
  name: string,
  description: string,
}

const EditSecurityModalFn = (props: Props) => {
  const { onCloseModal, onSuccess } = props;

  const securityQuery = useSecurityQuery({ variables: { securityName: props.name } });
  const [editSecurity] = useEditSecurityMutation();

  const { name = '', description = '' } = securityQuery.data?.tradingEngine.security || {};

  const handleSubmit = async (data: FormValues) => {
    try {
      await editSecurity({
        variables: {
          securityName: name,
          ...data,
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.TITLE'),
        message: error.error === 'error.security.already.exist'
          ? I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.FAILED'),
      });
    }
  };

  return (
    <Modal toggle={onCloseModal} isOpen>
      <Formik
        initialValues={{
          name,
          description,
        }}
        validate={
          createValidator(
            {
              name: ['required', `regex:${securityNamePattern}`],
              description: 'string',
            },
            {
              name: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NAME'),
              description: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.DESCRIPTION'),
            },
            false,
            {
              'regex.name': I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.INVALID_NAME'),
            },
          )
        }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ dirty, isSubmitting }) => (
          <>
            <ModalHeader
              toggle={onCloseModal}
            >
              {I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.TITLE')}
            </ModalHeader>

            <Form>
              <ModalBody>
                <Field
                  name="name"
                  type="text"
                  data-testid="EditSecurityModalFn-nameInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="description"
                  type="text"
                  data-testid="EditSecurityModalFn-descriptionInput"
                  label={I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.DESCRIPTION')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  data-testid="EditSecurityModalFn-cancelButton"
                  onClick={onCloseModal}
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  danger
                  disabled={!dirty || isSubmitting}
                  data-testid="EditSecurityModalFn-saveButton"
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

export default React.memo(EditSecurityModalFn);
