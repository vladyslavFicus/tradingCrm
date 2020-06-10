import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { manualPaymentMethodsLabels } from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import getManualPaymentMethodsQuery from './graphql/getManualPaymentMethodsQuery';
import approvePaymentMutation from './graphql/approvePaymentMutation';
import './ApprovePaymentForm.scss';

const attributeLabels = {
  paymentMethod: 'PAYMENT_DETAILS_MODAL.CHOOSE_PAYMENT_METHOD_LABEL',
};

class ApprovePaymentForm extends PureComponent {
  static propTypes = {
    manualPaymentMethods: PropTypes.manualPaymentMethods.isRequired,
    approvePayment: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    paymentId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleApprovePayment = async ({ paymentMethod }) => {
    const {
      approvePayment,
      onCloseModal,
      paymentId,
      onSuccess,
      notify,
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
        paymentMethod,
        typeAcc: 'approve',
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t(success ? 'COMMON.SUCCESS' : 'COMMON.FAIL'),
      message: I18n.t(
        success
          ? 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_SUCCESS'
          : 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_FAILED',
      ),
    });

    if (success) {
      onSuccess();
      onCloseModal();
    }
  }

  render() {
    const { manualPaymentMethods } = this.props;

    const manualMethods = get(manualPaymentMethods, 'data.manualPaymentMethods.data') || [];

    return (
      <Formik
        initialValues={{}}
        validate={
          createValidator({
            paymentMethod: ['string', 'required'],
          }, translateLabels(attributeLabels), false)
        }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={this.handleApprovePayment}
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
              {I18n.t('PAYMENT_DETAILS_MODAL.ACTIONS.APPROVE')}
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    approvePayment: approvePaymentMutation,
    manualPaymentMethods: getManualPaymentMethodsQuery,
  }),
)(ApprovePaymentForm);