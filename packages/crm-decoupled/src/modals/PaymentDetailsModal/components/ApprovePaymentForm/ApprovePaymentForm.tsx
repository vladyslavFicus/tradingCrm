import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils, Constants, parseErrors, notify, Types } from '@crm/common';
import { Button, FormikSingleSelectField } from 'components';
import { useApprovePaymentMutation } from './graphql/__generated__/ApprovePaymentMutation';
import { useManualPaymentMethodsQuery } from './graphql/__generated__/ManualPaymentMethodsQuery';
import './ApprovePaymentForm.scss';

const attributeLabels = {
  paymentMethod: 'PAYMENT_DETAILS_MODAL.CHOOSE_PAYMENT_METHOD_LABEL',
};

type FormValues = {
  paymentMethod: string,
};

type Props = {
  paymentId: string,
  onSuccess: () => void,
};

const ApprovePaymentForm = (props: Props) => {
  const { paymentId, onSuccess } = props;

  const { data } = useManualPaymentMethodsQuery();
  const manualMethods = data?.manualPaymentMethods || [];

  const [approvePaymentMutation] = useApprovePaymentMutation();

  const handleApprovePayment = async ({ paymentMethod }: FormValues) => {
    try {
      await approvePaymentMutation({
        variables: {
          paymentId,
          paymentMethod,
          typeAcc: 'approve',
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_SUCCESS'),
      });

      onSuccess();
    } catch (e) {
      const error = parseErrors(e);

      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: error.message || I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.APPROVE_FAILED'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        paymentMethod: '',
      } as FormValues}
      validate={
          Utils.createValidator({
            paymentMethod: ['string', 'required'],
          }, Utils.translateLabels(attributeLabels), false)
        }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleApprovePayment}
    >
      {({ values, isSubmitting }) => (
        <Form className="ApprovePaymentForm">
          <Field
            name="paymentMethod"
            label={I18n.t(attributeLabels.paymentMethod)}
            placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
            component={FormikSingleSelectField}
            options={(manualMethods as Array<Constants.Payment.manualPaymentMethods>)
              .filter(item => item !== Constants.Payment.manualPaymentMethods.COMMISSION)
              .map(item => ({
                label: Constants.Payment.manualPaymentMethodsLabels[item]
                  ? I18n.t(Constants.Payment.manualPaymentMethodsLabels[item])
                  : Utils.formatLabel(item || ''),
                value: item,
              }))}
          />

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
};

export default React.memo(ApprovePaymentForm);
