import React, { PureComponent } from 'react';
import { compose } from 'react-apollo';
import { get } from 'lodash';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import PropTypes from 'constants/propTypes';
import { statusMapper, statusesLabels, statuses } from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import getManualPaymentMethodsQuery from './graphql/getManualPaymentMethodsQuery';
import updatePaymentStatusMutation from './graphql/updatePaymentStatusMutation';
import updatePaymentMethodMutation from './graphql/updatePaymentMethodMutation';
import './ChangePaymentStatusForm.scss';

const attributeLabels = {
  paymentMethod: 'PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD',
  paymentStatus: 'PAYMENT_DETAILS_MODAL.HEADER_STATUS',
};

class ChangePaymentStatusForm extends PureComponent {
  static propTypes = {
    manualPaymentMethods: PropTypes.manualPaymentMethods.isRequired,
    updatePaymentStatus: PropTypes.func.isRequired,
    updatePaymentMethod: PropTypes.func.isRequired,
    onCloseModal: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
  };

  handleSubmit = async (values, { setSubmitting, validateForm }) => {
    setSubmitting(false);

    const {
      updatePaymentMethod,
      updatePaymentStatus,
      onCloseModal,
      onSuccess,
      paymentId,
      notify,
    } = this.props;

    const { paymentStatus, paymentMethod } = values;
    const errors = [];

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

    if (paymentStatus) {
      const {
        data: {
          payment: {
            changePaymentStatus: {
              data: {
                success,
              },
            },
          },
        },
      } = await updatePaymentStatus({
        variables: { paymentId, paymentStatus },
      });

      if (!success) {
        errors.push('ERROR_STATUS');
      }
    }

    if (paymentMethod) {
      const {
        data: {
          payment: {
            changePaymentMethod: {
              data: {
                success,
              },
            },
          },
        },
      } = await updatePaymentMethod({
        variables: { paymentId, paymentMethod },
      });

      if (!success) {
        errors.push('ERROR_METHOD');
      }
    }

    notify({
      level: errors.length ? 'error' : 'success',
      title: I18n.t(errors.length ? 'COMMON.FAIL' : 'COMMON.SUCCESS'),
      message: I18n.t(
        errors.length
          ? `PAYMENT_DETAILS_MODAL.NOTIFICATIONS.${errors.length === 2 ? 'ERROR' : errors[0]}`
          : 'PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY',
      ),
    });

    if (!errors.length) {
      onCloseModal();
      onSuccess();
    }
  }

  render() {
    const { manualPaymentMethods } = this.props;

    const manualMethods = get(manualPaymentMethods, 'data.manualPaymentMethods.data') || [];
    const isManualPaymentsLoading = manualPaymentMethods.loading;

    return (
      <Formik
        initialValues={{
          paymentStatus: '',
          paymentMethod: '',
        }}
        validate={
          createValidator({
            paymentStatus: ['string'],
            paymentMethod: ['string'],
          }, translateLabels(attributeLabels), false)
        }
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={this.handleSubmit}
      >
        {({ dirty, isSubmitting }) => (
          <Form className="ChangePaymentStatusForm">
            <div className="ChangePaymentStatusForm__fields">
              <Field
                name="paymentStatus"
                className="ChangePaymentStatusForm__field"
                label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_STATUS')}
                placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
                component={FormikSelectField}
              >
                {
                  Object
                    .entries(statusMapper)
                    .filter(([item]) => item !== statuses.PENDING)
                    .map(([key, value]) => (
                      <option key={key} value={value[0]}>
                        {I18n.t(renderLabel(key, statusesLabels))}
                      </option>
                    ))
                }
              </Field>
              <Field
                name="paymentMethod"
                className="ChangePaymentStatusForm__field"
                label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_PAYMENT_METHOD')}
                placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
                component={FormikSelectField}
                disabled={isManualPaymentsLoading}
              >
                {manualMethods.map(item => (
                  <option key={item} value={item}>
                    {formatLabel(item)}
                  </option>
                ))}
              </Field>
            </div>

            <div className="ChangePaymentStatusForm__buttons">
              <Button
                className="ChangePaymentStatusForm__button"
                type="submit"
                primary
                disabled={!dirty || isSubmitting}
              >
                {I18n.t('COMMON.SAVE_CHANGES')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default compose(
  withNotifications,
  withRequests({
    updatePaymentStatus: updatePaymentStatusMutation,
    updatePaymentMethod: updatePaymentMethodMutation,
    manualPaymentMethods: getManualPaymentMethodsQuery,
  }),
)(ChangePaymentStatusForm);