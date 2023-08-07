import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { notify, LevelType } from 'providers/NotificationProvider';
import { statusMapper, statusesLabels, statuses } from 'constants/payment';
import { createValidator, translateLabels } from 'utils/validator';
import renderLabel from 'utils/renderLabel';
import formatLabel from 'utils/formatLabel';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components';
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
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t(`PAYMENT_DETAILS_MODAL.NOTIFICATIONS.${errors.length === 2 ? 'ERROR' : errors[0]}`),
      });
    } else {
      notify({
        level: LevelType.SUCCESS,
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
          createValidator({
            paymentStatus: ['string'],
            paymentMethod: ['string'],
          }, translateLabels(attributeLabels), false)
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
              disabled={loading || disablePaymentMethod}
            >
              {(manualMethods as Array<string>).filter(item => item !== 'COMMISSION').map(item => (
                <option key={item} value={item}>
                  {formatLabel(item || '')}
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
};

export default React.memo(ChangePaymentStatusForm);
