import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { BaseMutationOptions, MutationResult } from '@apollo/client';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify, LevelType } from 'types/notify';
import { securityNamePattern } from '../../constants';
import CreateSecurityMutation from './graphql/CreateSecurityMutation';

interface CreateSecurityResponse {
  createSecurity: null,
}

interface Props {
  notify: Notify,
  createSecurity: (options: BaseMutationOptions) => MutationResult<CreateSecurityResponse>,
  onCloseModal: () => void,
  onSuccess: () => void,
}

interface InitialValuesProps {
  name: string,
  description: string,
}

class NewSecurityModal extends PureComponent<Props> {
  onSubmit = async (variables: InitialValuesProps) => {
    const {
      createSecurity,
      notify,
      onCloseModal,
      onSuccess,
    } = this.props;

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

  render() {
    const {
      onCloseModal,
    } = this.props;

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
          onSubmit={this.onSubmit}
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
                    commonOutline
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
  }
}

export default compose(
  withNotifications,
  withRequests({
    createSecurity: CreateSecurityMutation,
  }),
)(NewSecurityModal);
