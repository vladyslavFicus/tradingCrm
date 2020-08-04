import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import { createValidator, translateLabels } from 'utils/validator';
import ChangeUnauthorizedPasswordMutation from './graphql/ChangeUnauthorizedPasswordMutation';
import './ChangeUnauthorizedPasswordModal.scss';

const PASSWORD_PATTERN = '^((?=.*\\d)(?=.*[a-zA-Z]).{6,16})$';

const fieldLabels = {
  oldPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.OLD_PASSWORD',
  newPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NEW_PASSWORD',
  repeatPassword: 'MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.REPEAT_PASSWORD',
};

class ChangeUnauthorizedPasswordModal extends PureComponent {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    changeUnauthorizedPassword: PropTypes.func.isRequired,
  };

  state = {
    formError: null,
  };

  onHandleSubmit = async (values, { setSubmitting }) => {
    const {
      uuid,
      notify,
      onSuccess,
      onCloseModal,
      changeUnauthorizedPassword,
    } = this.props;

    try {
      await changeUnauthorizedPassword({ variables: { uuid, ...values } });

      onSuccess();
      onCloseModal();

      notify({
        level: 'success',
        title: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.SUCCEED.TITLE'),
        message: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.SUCCEED.MESSAGE'),
      });
    } catch (e) {
      const error = parseErrors(e);

      if (error.error === 'error.validation.password.repeated') {
        this.setState({ formError: I18n.t(error.error) });
      } else {
        this.setState({ formError: null });

        notify({
          level: 'error',
          title: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.TITLE'),
          message: I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.NOTIFICATIONS.ERROR.MESSAGE'),
        });
      }
    }

    setSubmitting(false);
  };

  render() {
    const { onCloseModal } = this.props;
    const { formError } = this.state;

    return (
      <Modal className="ChangeUnauthorizedPasswordModal" toggle={onCloseModal} isOpen>
        <Formik
          initialValues={{}}
          validate={
            createValidator({
              oldPassword: ['required'],
              newPassword: ['required', `regex:${PASSWORD_PATTERN}`],
              repeatPassword: ['required', 'same:newPassword'],
            }, translateLabels(fieldLabels), false)
          }
          onSubmit={this.onHandleSubmit}
        >
          {({ dirty, isValid, isSubmitting }) => (
            <Form>
              <ModalHeader
                className="ChangeUnauthorizedPasswordModal__header"
                toggle={onCloseModal}
              >
                {I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.TITLE')}
              </ModalHeader>

              <ModalBody>
                <If condition={formError}>
                  <div className="ChangeUnauthorizedPasswordModal__error">
                    {formError}
                  </div>
                </If>

                <div className="ChangeUnauthorizedPasswordModal__subtitle">
                  {I18n.t('MODALS.CHANGE_UNAUTHORIZED_PASSWORD_MODAL.SUBTITLE')}
                </div>
                <Field
                  name="oldPassword"
                  type="password"
                  label={I18n.t(fieldLabels.oldPassword)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="newPassword"
                  type="password"
                  label={I18n.t(fieldLabels.newPassword)}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
                <Field
                  name="repeatPassword"
                  type="password"
                  label={I18n.t(fieldLabels.repeatPassword)}
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
                  disabled={!dirty || !isValid || isSubmitting}
                  type="submit"
                >
                  {I18n.t('COMMON.BUTTONS.SAVE_NEW_PASSWORD')}
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
    changeUnauthorizedPassword: ChangeUnauthorizedPasswordMutation,
  }),
)(ChangeUnauthorizedPasswordModal);
