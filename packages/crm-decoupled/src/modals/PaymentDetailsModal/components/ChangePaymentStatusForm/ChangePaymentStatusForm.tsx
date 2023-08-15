import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Utils, Constants, notify, Types } from '@crm/common';
import { Button, FormikSingleSelectField } from 'components';
import { useUpdatePaymentMethodMutation } from './graphql/__generated__/UpdatePaymentMethodMutation';
import { useUpdatePaymentStatusMutation } from './graphql/__generated__/UpdatePaymentStatusMutation';
import { useManualPaymentMethodsQuery } from './graphql/__generated__/ManualPaymentMethodsQuery';
import './ChangePaymentStatusForm.scss';

const attributeLabels = {
  paymentMethod: 'PAYMENT_DETAILS_MODAL.HEADER_PAYMENT_METHOD',
  paymentStatus: 'PAYMENT_DETAILS_MODAL.HEADER_STATUS',
};

type FormValues = {
  paymentStatus: string,
  paymentMethod: string,
};

type Props = {
  disablePaymentMethod: boolean,
  paymentId: string,
  onCloseModal: () => void,
  onSuccess: () => void,
};

const ChangePaymentStatusForm = (props: Props) => {
  const {
    disablePaymentMethod,
    paymentId,
    onCloseModal,
    onSuccess,
  } = props;

  const { data, loading } = useManualPaymentMethodsQuery();
  const manualMethods = data?.manualPaymentMethods || [];

  const [updatePaymentMethodMutation] = useUpdatePaymentMethodMutation();
  const [updatePaymentStatusMutation] = useUpdatePaymentStatusMutation();

  const handleSubmit = async (values: FormValues, { setSubmitting, validateForm }: FormikHelpers<FormValues>) => {
    setSubmitting(false);

    const { paymentStatus, paymentMethod } = values;
    const errors = [];

    const validationResult = await validateForm(values);
    const hasValidationErrors = Object.keys(validationResult).length > 0;

    if (hasValidationErrors) return;

    if (paymentStatus) {
      try {
        await updatePaymentStatusMutation({ variables: { paymentId, paymentStatus } });
      } catch (e) {
        errors.push('ERROR_STATUS');
      }
    }

    if (paymentMethod) {
      try {
        await updatePaymentMethodMutation({ variables: { paymentId, paymentMethod } });
      } catch (e) {
        errors.push('ERROR_METHOD');
      }
    }

    if (errors.length) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t(`PAYMENT_DETAILS_MODAL.NOTIFICATIONS.${errors.length === 2 ? 'ERROR' : errors[0]}`),
      });
    } else {
      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.SUCCESSFULLY'),
      });

      onCloseModal();
      onSuccess();
    }
  };

  return (
    <Formik
      initialValues={{
        paymentStatus: '',
        paymentMethod: '',
      }}
      validate={
          Utils.createValidator({
            paymentStatus: ['string'],
            paymentMethod: ['string'],
          }, Utils.translateLabels(attributeLabels), false)
        }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting }) => (
        <Form className="ChangePaymentStatusForm">
          <div className="ChangePaymentStatusForm__fields">
            <Field
              name="paymentStatus"
              className="ChangePaymentStatusForm__field"
              label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_STATUS')}
              placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
              component={FormikSingleSelectField}
              options={Object.entries(Constants.Payment.statusMapper)
                .filter(([item]) => item !== Constants.Payment.statuses.PENDING)
                .map(([key, value]) => ({
                  label: I18n.t(Utils.renderLabel(key, Constants.Payment.statusesLabels)),
                  value: value[0],
                }))}
            />

            <Field
              name="paymentMethod"
              className="ChangePaymentStatusForm__field"
              label={I18n.t('PAYMENT_DETAILS_MODAL.CHANGE_PAYMENT_METHOD')}
              placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
              component={FormikSingleSelectField}
              disabled={loading || disablePaymentMethod}
              options={(manualMethods as Array<string>).filter(item => item !== 'COMMISSION').map(item => ({
                label: Utils.formatLabel(item || ''),
                value: item,
              }))}
            />
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
};

export default React.memo(ChangePaymentStatusForm);
