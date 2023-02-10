import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { get } from 'lodash';
import { Formik, Form, Field } from 'formik';
import { withRequests, parseErrors } from 'apollo';
import { notify, LevelType } from 'providers/NotificationProvider';
import PropTypes from 'constants/propTypes';
import { manualPaymentMethodsLabels } from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
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
    paymentId: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
  };

  handleApprovePayment = async ({ paymentMethod }) => {
    const {
      approvePayment,
      paymentId,
      onSuccess,
    } = this.props;

    try {
      await approvePayment({
        variables: {
          paymentId,
          paymentMethod,
          typeAcc: 'approve',
        },
      });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_SUCCESS'),
      });

      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_FAILED'),
      });
    }
  }

  render() {
    const { manualPaymentMethods } = this.props;

    const manualMethods = get(manualPaymentMethods, 'data.manualPaymentMethods') || [];

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
  withRequests({
    approvePayment: approvePaymentMutation,
    manualPaymentMethods: getManualPaymentMethodsQuery,
  }),
)(ApprovePaymentForm);
