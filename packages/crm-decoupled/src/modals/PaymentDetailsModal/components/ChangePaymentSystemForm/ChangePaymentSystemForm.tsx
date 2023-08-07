import React, { useState } from 'react';
import I18n from 'i18n-js';
import { Field, Form, Formik } from 'formik';
import { createValidator } from 'utils/validator';
import { LevelType, notify } from 'providers/NotificationProvider';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button } from 'components';
import { SetFieldValue } from 'types/formik';
import { useUpdatePaymentSystemMutation } from './graphql/__generated__/UpdatePaymentSystemMutation';
import { usePaymentSystemsProviderQuery } from './graphql/__generated__/PaymentSystemsProviderQuery';
import './ChangePaymentSystemForm.scss';

type FormValues = {
  paymentSystem: string,
  paymentSystemName: string,
};

type Props = {
  paymentId: string,
  onSuccess: () => void,
};

const ChangePaymentSystemForm = (props: Props) => {
  const { paymentId, onSuccess } = props;
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);

  // ===== Requests ===== //
  const { data, loading } = usePaymentSystemsProviderQuery({
    variables: {
      args: {
        withFavouriteStatus: true,
        page: {
          from: 0,
          size: 1000,
        },
      },
    },
  });

  const paymentSystems = data?.settings?.paymentSystemsProvider?.content || [];

  const [updatePaymentSystemMutation] = useUpdatePaymentSystemMutation();

  const onChangePaymentSystem = (value: string, setFieldValue: SetFieldValue<FormValues>) => {
    setFieldValue('paymentSystem', value);
    setIsOtherSelected(value === 'UNDEFINED');
  };

  const resolvePaymentSystemValue = (paymentSystem: string, paymentSystemName: string): string => {
    const isOtherPaymentSystem = paymentSystem === 'UNDEFINED';
    return isOtherPaymentSystem ? `Other (${paymentSystemName})` : paymentSystem;
  };

  const handleSubmit = async ({ paymentSystem, paymentSystemName }: FormValues) => {
    try {
      const paymentSystemValue = resolvePaymentSystemValue(paymentSystem, paymentSystemName);
      await updatePaymentSystemMutation({ variables: { paymentId, paymentSystem: paymentSystemValue } });

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.UPDATE_SYSTEM_SUCCESS'),
      });

      onSuccess();
    } catch (e) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.FAIL'),
        message: I18n.t('PAYMENT_DETAILS_MODAL.NOTIFICATIONS.UPDATE_SYSTEM_ERROR'),
      });
    }
  };

  return (
    <Formik
      initialValues={{
        paymentSystem: '',
        paymentSystemName: '',
      }}
      validate={
        createValidator({
          paymentSystem: ['string'],
          paymentSystemName: ['string'],
        }, {
          paymentSystem: I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM'),
          paymentSystemName: I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM_NAME'),
        }, false)
      }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, setFieldValue }) => (
        <Form className="ChangePaymentSystemForm">
          <div className="ChangePaymentSystemForm__fields">
            <Field
              name="paymentSystem"
              className="ChangePaymentSystemForm__field"
              label={I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM')}
              placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
              component={FormikSelectField}
              disabled={loading}
              withGroup={{ firstTitle: 'COMMON.FAVORITE', secondTitle: 'COMMON.OTHER' }}
              customOnChange={(value: string) => onChangePaymentSystem(value, setFieldValue)}
            >
              {[<option key="NONE" value="NONE">{I18n.t('COMMON.NONE')}</option>,
                ...paymentSystems.map(({ paymentSystem, isFavourite }) => (
                  <option key={paymentSystem} value={paymentSystem} data-isFavourite={isFavourite}>
                    {paymentSystem}
                  </option>
                )),
                <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
              ]}
            </Field>

            <If condition={!!isOtherSelected}>
              <Field
                name="paymentSystemName"
                className="ChangePaymentSystemForm__field"
                label={I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM_NAME')}
                component={FormikInputField}
              />
            </If>
          </div>

          <div className="ChangePaymentSystemForm__buttons">
            <Button
              className="ChangePaymentSystemForm__button"
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

export default React.memo(ChangePaymentSystemForm);
