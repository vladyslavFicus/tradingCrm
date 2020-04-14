import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { getPaymentReason } from 'config';
import { createValidator, translateLabels } from 'utils/validator';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import rejectPaymentMutation from './graphql/rejectPaymentMutation';
import './RejectPaymentForm.scss';

const attributeLabels = {
  declineReason: 'PAYMENT_DETAILS_MODAL.CHOOSE_REJECTION_REASONS_LABEL',
};

class RejectPaymentForm extends PureComponent {
  static propTypes = {
    onSuccess: PropTypes.func.isRequired,
    paymentId: PropTypes.string.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleRejectPayment = async (values, { setSubmitting, validateForm }) => {
    setSubmitting(false);

    const {
      rejectPayment,
      paymentId,
      onSuccess,
      notify,
    } = this.props;

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

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
    } = await rejectPayment({
      variables: {
        paymentId,
        declineReason: values.declineReason,
        typeAcc: 'reject',
      },
    });

    notify({
      level: success ? 'success' : 'error',
      title: I18n.t(success ? 'COMMON.SUCCESS' : 'COMMON.FAIL'),
      message: I18n.t(
        success
          ? 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.REJECT_FAILED'
          : 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.REJECT_SUCCESS',
      ),
    });

    if (success) {
      onSuccess();
    }
  };

  render() {
    return (
      <Formik
        initialValues={{ declineReason: '' }}
        validate={
          createValidator({
            declineReason: ['string', 'required'],
          }, translateLabels(attributeLabels), false)
        }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={this.handleRejectPayment}
      >
        {({ values, isSubmitting }) => (
          <Form className="RejectPaymentForm">
            <Field
              name="declineReason"
              label={I18n.t(attributeLabels.declineReason)}
              placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
              component={FormikSelectField}
            >
              {getPaymentReason().refuse.map((reason, key) => (
                <option key={key} value={reason}>
                  {formatLabel(reason)}
                </option>
              ))}
            </Field>

            <Button
              common
              type="submit"
              disabled={!values.declineReason || isSubmitting}
            >
              {I18n.t('PAYMENT_DETAILS_MODAL.ACTIONS.REJECT')}
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
    rejectPayment: rejectPaymentMutation,
  }),
)(RejectPaymentForm);
