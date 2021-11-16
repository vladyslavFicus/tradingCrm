import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { compose, MutationResult } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import CreateSecuritiesMutation from './graphql/CreateSecuritiesMutation';

interface CreateSecurities {
  createSecurities: null,
}

interface Props {
  notify: (values: Object) => void,
  createSecurities: (values: Object) => MutationResult<CreateSecurities>,
  onCloseModal: () => void,
  onSuccess: () => void,
}

class NewSecuritiesModal extends PureComponent<Props> {
  onSubmit = async (data: { name?: string, description?: string }) => {
    const {
      createSecurities,
      notify,
      onCloseModal,
      onSuccess,
    } = this.props;

    try {
      await createSecurities({
        variables: {
          ...data,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.TITLE'),
        message: error.error === 'error.security.already.exist'
          ? I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.NOTIFICATION.FAILED'),
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
            <Form>
              <ModalHeader
                toggle={onCloseModal}
              >
                {I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.TITLE')}
              </ModalHeader>

              <ModalBody>
                <Field
                  name="name"
                  type="text"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="description"
                  type="text"
                  label={I18n.t('TRADING_ENGINE.MODALS.NEW_SECURITIES_MODAL.DESCRIPTION')}
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
          )}
        </Formik>
      </Modal>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    createSecurities: CreateSecuritiesMutation,
  }),
)(NewSecuritiesModal);
