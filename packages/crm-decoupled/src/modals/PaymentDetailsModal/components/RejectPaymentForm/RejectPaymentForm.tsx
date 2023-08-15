import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Config, Utils, notify, Types } from '@crm/common';
import { Button, FormikSingleSelectField } from 'components';
import { useRejectPaymentMutation } from './graphql/__generated__/RejectPaymentMutation';
import './RejectPaymentForm.scss';

const attributeLabels = {
  declineReason: 'PAYMENT_DETAILS_MODAL.CHOOSE_REJECTION_REASONS_LABEL',
};

type FormValues = {
  declineReason: string,
};

type Props = {
  paymentId: string,
  onSuccess: () => void,
};

const RejectPaymentForm = (props: Props) => {
  const { paymentId, onSuccess } = props;

  const [rejectPaymentMutation] = useRejectPaymentMutation();

  const handleRejectPayment = async (values: FormValues,
    { setSubmitting, validateForm }: FormikHelpers<FormValues>) => {
    setSubmitting(false);

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

    try {
      await rejectPaymentMutation({
        variables: {
          paymentId,
          declineReason: values.declineReason,
          typeAcc: 'reject',
        },
      });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.REJECT_SUCCESS'),
      });

      onSuccess();
    } catch (e) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.REJECT_FAILED'),
      });
    }
  };

  return (
    <Formik
      initialValues={{ declineReason: '' } as FormValues}
      validate={
          Utils.createValidator({
            declineReason: ['string', 'required'],
          }, Utils.translateLabels(attributeLabels), false)
        }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleRejectPayment}
    >
      {({ values, isSubmitting }) => (
        <Form className="RejectPaymentForm">
          <Field
            name="declineReason"
            label={I18n.t(attributeLabels.declineReason)}
            placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
            component={FormikSingleSelectField}
            options={Config.getPaymentReason().refuse.map((reason: string) => ({
              label: Utils.formatLabel(reason),
              value: reason,
            }))}
          />

          <Button
            secondary
            type="submit"
            disabled={!values.declineReason || isSubmitting}
          >
            {I18n.t('PAYMENT_DETAILS_MODAL.ACTIONS.REJECT')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(RejectPaymentForm);
