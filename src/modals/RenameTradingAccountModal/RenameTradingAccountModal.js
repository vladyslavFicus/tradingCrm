import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField } from 'components/Formik';
import { Button } from 'components/UI';
import RenameTradingAccountMutation from './graphql/RenameTradingAccountMutation';
import './RenameTradingAccountModal.scss';

const attributeLabels = {
  name: 'MODALS.UPDATE_TRADING_ACCOUNT_MODAL.LABLES.NAME',
};

class RenameTradingAccountModal extends PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    renameTradingAccount: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    accountUUID: PropTypes.string.isRequired,
  }

  handleSubmit = async (values, { setSubmitting }) => {
    const {
      renameTradingAccount,
      onSuccess,
      onCloseModal,
      accountUUID,
    } = this.props;

    try {
      await renameTradingAccount({
        variables: {
          accountUUID,
          ...values,
        },
      });

      onSuccess();
      onCloseModal();

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.SUCCESS'),
      });
    } catch {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.NOTIFICATION.ERROR'),
      });
    }

    setSubmitting(false);
  };

  render() {
    const {
      isOpen,
      onCloseModal,
    } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        toggle={onCloseModal}
      >
        <Formik
          initialValues={{}}
          validate={createValidator({
            name: ['required', 'string'],
          }, translateLabels(attributeLabels), false)}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                {I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.TITLE')}
              </ModalHeader>
              <ModalBody>
                <Field
                  name="name"
                  label={I18n.t(attributeLabels.name)}
                  placeholder={I18n.t('COMMON.NAME')}
                  component={FormikInputField}
                  disabled={isSubmitting}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="RenameTradingAccountModal__button"
                  onClick={onCloseModal}
                  tertiary
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  className="RenameTradingAccountModal__button"
                  disabled={isSubmitting}
                  type="submit"
                  primary
                >
                  {I18n.t('MODALS.UPDATE_TRADING_ACCOUNT_MODAL.UPDATE_BUTTON')}
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
  withRequests({
    renameTradingAccount: RenameTradingAccountMutation,
  }),
)(RenameTradingAccountModal);
