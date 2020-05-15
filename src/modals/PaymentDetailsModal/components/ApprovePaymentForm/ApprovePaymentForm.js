import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { departments, roles } from 'constants/brands';
import { withdrawStatuses, manualPaymentMethodsLabels } from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import getManualPaymentMethodsQuery from './graphql/getManualPaymentMethodsQuery';
import approvePaymentMutation from './graphql/approvePaymentMutation';
import approvePaymentFinalMutation from './graphql/approvePaymentFinalMutation';
import './ApprovePaymentForm.scss';

const attributeLabels = {
  paymentMethod: 'PAYMENT_DETAILS_MODAL.CHOOSE_PAYMENT_METHOD_LABEL',
};

class ApprovePaymentForm extends PureComponent {
  static propTypes = {
    manualPaymentMethods: PropTypes.manualPaymentMethods.isRequired,
    withdrawStatus: PropTypes.string.isRequired,
    approvePayment: PropTypes.func.isRequired,
    approvePaymentFinal: PropTypes.func.isRequired,
    paymentId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    auth: PropTypes.auth.isRequired,
  };

  handleFinalApprovePayment = async (values, { setSubmitting, validateForm }) => {
    setSubmitting(false);

    const {
      approvePaymentFinal,
      paymentId,
      onSuccess,
    } = this.props;

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

    const {
      data: {
        payment: {
          acceptPaymentFinal: {
            data: {
              success,
            },
          },
        },
      },
    } = await approvePaymentFinal({
      variables: {
        paymentId,
        paymentMethod: values.paymentMethod,
      },
    });

    this.showNotification(success);

    if (success) {
      onSuccess();
    }
  };

  handleMiddleApprovePayment = async () => {
    const {
      approvePayment,
      paymentId,
      onSuccess,
    } = this.props;

    const {
      data: {
        payment: {
          acceptPayment: {
            data: {
              success,
            },
          },
        },
      },
    } = await approvePayment({
      variables: {
        paymentId,
        typeAcc: 'approve',
      },
    });

    this.showNotification(success);

    if (success) {
      onSuccess();
    }
  }

  showNotification = (success) => {
    const { notify } = this.props;

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t(success ? 'COMMON.SUCCESS' : 'COMMON.FAIL'),
      message: I18n.t(
        success
          ? 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_SUCCESS'
          : 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_FAILED',
      ),
    });
  }

  getButtonLabel = () => {
    const { withdrawStatus } = this.props;

    switch (withdrawStatus) {
      case withdrawStatuses.DEALING_REVIEW: {
        return 'PAYMENT_DETAILS_MODAL.ACTIONS.APPROVE.MOVE_TO_SALES_REVIEW';
      }
      case withdrawStatuses.SALES_REVIEW: {
        return 'PAYMENT_DETAILS_MODAL.ACTIONS.APPROVE.MOVE_TO_FINANCE_TO_EXECUTE';
      }
      case withdrawStatuses.FINANCE_TO_EXECUTE: {
        return 'PAYMENT_DETAILS_MODAL.ACTIONS.APPROVE.APPROVE_WITHDRAW';
      }
      default: {
        return 'PAYMENT_DETAILS_MODAL.ACTIONS.APPROVE.DEFAULT';
      }
    }
  };

  render() {
    const {
      manualPaymentMethods,
      auth: { department, role },
      withdrawStatus,
    } = this.props;

    const manualMethods = get(manualPaymentMethods, 'data.manualPaymentMethods.data') || [];

    const isAvailableToApprove = (withdrawStatus === withdrawStatuses.FINANCE_TO_EXECUTE)
      ? [departments.ADMINISTRATION, departments.FINANCE].includes(department)
      || ([departments.CS].includes(department) && [roles.ROLE4].includes(role))
      : true;

    if (!isAvailableToApprove) return null;

    const isFinanceToExecute = withdrawStatus === withdrawStatuses.FINANCE_TO_EXECUTE;

    return (
      <Choose>
        <When condition={isFinanceToExecute}>
          <Formik
            initialValues={{ paymentMethod: '' }}
            validate={
              createValidator({
                paymentMethod: ['string', 'required'],
              }, translateLabels(attributeLabels), false)
            }
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={this.handleFinalApprovePayment}
          >
            {({ values, isSubmitting }) => (
              <Form className="ApprovePaymentForm">
                <Field
                  name="paymentMethod"
                  label={I18n.t(attributeLabels.paymentMethod)}
                  placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
                  component={FormikSelectField}
                >
                  {manualMethods.map(item => (
                    <option key={item} value={item}>
                      {manualPaymentMethodsLabels[item]
                        ? I18n.t(manualPaymentMethodsLabels[item])
                        : formatLabel(item)
                      }
                    </option>
                  ))}
                </Field>

                <Button
                  primary
                  type="submit"
                  disabled={!values.paymentMethod || isSubmitting}
                >
                  {I18n.t(this.getButtonLabel())}
                </Button>
              </Form>
            )}
          </Formik>
        </When>
        <Otherwise>
          <Button
            primary
            className="ApprovePaymentForm__approve-button"
            onClick={this.handleMiddleApprovePayment}
          >
            {I18n.t(this.getButtonLabel())}
          </Button>
        </Otherwise>
      </Choose>
    );
  }
}

export default compose(
  withNotifications,
  withStorage(['auth']),
  withRequests({
    approvePayment: approvePaymentMutation,
    approvePaymentFinal: approvePaymentFinalMutation,
    manualPaymentMethods: getManualPaymentMethodsQuery,
  }),
)(ApprovePaymentForm);
