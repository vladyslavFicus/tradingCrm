import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import compose from 'compose-function';
import { MutationResult, MutationOptions, QueryResult } from 'react-apollo';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { Notify } from 'types/notify';
import EditSecurityMutation from './graphql/EditSecurityMutation';
import SecurityQuery from './graphql/SecurityQuery';

interface EditSecurityResponse {
  editSecurity: null,
}

interface SecurityData {
  tradingEngineSecurity: {
    name: string,
    description: string,
  },
}

interface Props {
  notify: Notify,
  editSecurity: (options: MutationOptions) => MutationResult<EditSecurityResponse>,
  securityQuery: QueryResult<SecurityData>,
  onCloseModal: () => void,
  onSuccess: () => void,
  name: string,
}

interface InitialsValuesProps {
  name: string,
  description: string,
}

class EditSecurityModal extends PureComponent<Props> {
  onSubmit = async (data: InitialsValuesProps) => {
    const {
      name,
      editSecurity,
      notify,
      onCloseModal,
      onSuccess,
    } = this.props;

    try {
      await editSecurity({
        variables: {
          securityName: name,
          ...data,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.TITLE'),
        message: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.SUCCESS'),
      });

      onSuccess();
      onCloseModal();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: 'error',
        title: I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.TITLE'),
        message: error.error === 'error.security.already.exist'
          ? I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.FAILED_EXIST')
          : I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NOTIFICATION.FAILED'),
      });
    }
  };

  render() {
    const {
      onCloseModal,
      securityQuery: {
        data,
      },
    } = this.props;

    const { name = '', description = '' } = data?.tradingEngineSecurity || {};

    return (
      <Modal toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{
            name,
            description,
          }}
          validate={createValidator({
            name: ['required', 'string'],
            description: 'string',
          })}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.onSubmit}
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
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.NAME')}
                    component={FormikInputField}
                    disabled={isSubmitting}
                  />
                  <Field
                    name="description"
                    type="text"
                    label={I18n.t('TRADING_ENGINE.MODALS.EDIT_SECURITY_MODAL.DESCRIPTION')}
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
    editSecurity: EditSecurityMutation,
    securityQuery: SecurityQuery,
  }),
)(EditSecurityModal);
