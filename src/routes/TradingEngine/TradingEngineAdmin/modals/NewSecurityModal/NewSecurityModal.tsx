import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { MutationResult, MutationOptions } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify } from 'types/notify';
import CreateSecurityMutation from './graphql/CreateSecurityMutation';

interface CreateSecurityResponse {
  createSecurity: null,
}

interface Props {
  notify: Notify,
  createSecurity: (options: MutationOptions) => MutationResult<CreateSecurityResponse>,
  onCloseModal: () => void,
  onSuccess: () => void,
}

class NewSecurityModal extends PureComponent<Props> {
  onSubmit = async (data: { name?: string, description?: string }) => {
    const {
      createSecurity,
      notify,
      onCloseModal,
      onSuccess,
    } = this.props;

    try {
      await createSecurity({
        variables: {
          ...data,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
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
          initialValues={{}}
          validate={createValidator({
            name: ['required', 'string'],
            description: 'required',
          })}
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
