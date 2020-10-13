import React, { PureComponent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { compose, withApollo } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests, parseErrors } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { Button } from 'components/UI';
import { FormikInputField } from 'components/Formik';
import { createValidator } from 'utils/validator';
import createRuleMutation from './graphql/createClientsDistributionRuleMutation';
import updateRuleMutation from './graphql/updateClientsDistributionRuleMutation';
import { actionTypes } from './attributes';

const attributeLabels = {
  ruleName: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME'),
  ruleOrder: I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER'),
};

const validate = createValidator({
  ruleName: ['required', 'string'],
  ruleOrder: ['required', 'numeric'],
}, attributeLabels, false);

class ClientsDistributionModal extends PureComponent {
  static propTypes = {
    onCloseModal: PropTypes.func.isRequired,
    createRule: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    formError: PropTypes.string,
    notify: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    ruleName: PropTypes.string,
    ruleOrder: PropTypes.string,
    uuid: PropTypes.string,
  };

  static defaultProps = {
    ruleName: '',
    ruleOrder: '',
    uuid: '',
    formError: '',
  };

  async handleCreate(ruleName, ruleOrder, setErrors, setSubmitting) {
    const {
      notify,
      createRule,
      onSuccess,
    } = this.props;

    try {
      await createRule({
        variables: {
          ruleName,
          ruleOrder,
        },
      });

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_SUCCESS', { ruleName }),
      });

      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      setErrors({
        submit: error.error === 'error.entity.already.exist'
          && I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }),
      });

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_FAILED'),
      });
    }

    setSubmitting(false);
  }

  async handleUpdate(ruleName, ruleOrder, setErrors, setSubmitting) {
    const {
      notify,
      updateRule,
      onSuccess,
      uuid,
    } = this.props;

    try {
      await updateRule({
        variables: {
          ruleName,
          ruleOrder,
          uuid,
        },
      });

      onSuccess();

      notify({
        level: 'success',
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_SUCCESS', { ruleName }),
      });
    } catch (e) {
      const error = parseErrors(e);

      setErrors({
        submit: error.error === 'error.entity.already.exist'
        && I18n.t('CLIENTS_DISTRIBUTION.CREATE_RULE_EXIST', { ruleName: error?.errorParameters?.ruleName }),
      });

      notify({
        level: 'error',
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('CLIENTS_DISTRIBUTION.UPDATE_RULE_FAILED'),
      });
    }

    setSubmitting(false);
  }

  handlePerformSubmitAction = ({ ruleName, ruleOrder }, { setErrors, setSubmitting }) => {
    const { action } = this.props;

    if (action === actionTypes.CREATE) {
      this.handleCreate(ruleName, ruleOrder, setErrors, setSubmitting);
    }

    if (action === actionTypes.UPDATE) {
      this.handleUpdate(ruleName, ruleOrder, setErrors, setSubmitting);
    }
  }

  render() {
    const {
      ruleName,
      ruleOrder,
      onCloseModal,
      isOpen,
      action,
      formError,
    } = this.props;

    return (
      <Modal
        toggle={onCloseModal}
        isOpen={isOpen}
      >
        <Formik
          initialValues={{ ruleName, ruleOrder }}
          validate={validate}
          onSubmit={this.handlePerformSubmitAction}
        >
          {({ errors, isValid, dirty, isSubmitting }) => (
            <Form>
              <ModalHeader toggle={onCloseModal}>
                <div>{I18n.t(`CLIENTS_DISTRIBUTION.${action}_MODAL.HEADER`)}</div>
              </ModalHeader>
              <ModalBody>
                <If condition={formError || errors.submit}>
                  <div className="mb-2 text-center color-danger">
                    {formError || errors.submit}
                  </div>
                </If>
                <Field
                  name="ruleName"
                  type="text"
                  label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
                  placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.NAME')}
                  component={FormikInputField}
                />
                <Field
                  name="ruleOrder"
                  type="number"
                  label={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
                  placeholder={I18n.t('CLIENTS_DISTRIBUTION.MODAL.FIELDS.ORDER')}
                  component={FormikInputField}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  commonOutline
                  onClick={onCloseModal}
                >
                  {I18n.t('COMMON.BUTTONS.CANCEL')}
                </Button>
                <Button
                  primary
                  type="submit"
                  disabled={!isValid || !dirty || isSubmitting}
                >
                  {I18n.t(`COMMON.BUTTONS.${action}`)}
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
  withApollo,
  withNotifications,
  withRequests({
    createRule: createRuleMutation,
    updateRule: updateRuleMutation,
  }),
)(ClientsDistributionModal);
