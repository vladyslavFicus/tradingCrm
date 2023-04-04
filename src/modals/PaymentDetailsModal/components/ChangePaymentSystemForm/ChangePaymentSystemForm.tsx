import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { createValidator } from 'utils/validator';
import { notify, LevelType } from 'providers/NotificationProvider';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/Buttons';
import { usePaymentSystemQuery } from './graphql/__generated__/PaymentSystemsQuery';
import { useUpdatePaymentSystemMutation } from './graphql/__generated__/UpdatePaymentSystemMutation';
import './ChangePaymentSystemForm.scss';

type FormValues = {
  paymentSystem: string,
};

type Props = {
  paymentId: string,
  onSuccess: () => void,
};

const ChangePaymentSystemForm = (props: Props) => {
  const { paymentId, onSuccess } = props;

  const { data, loading } = usePaymentSystemQuery();
  const paymentSystems = data?.paymentSystems || [];

  const [updatePaymentSystemMutation] = useUpdatePaymentSystemMutation();

  const handleSubmit = async ({ paymentSystem }: FormValues) => {
    try {
      await updatePaymentSystemMutation({ variables: { paymentId, paymentSystem } });

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
      }}
      validate={
          createValidator({
            paymentSystem: ['string'],
          }, {
            paymentSystem: I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM'),
          }, false)
        }
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting }) => (
        <Form className="ChangePaymentSystemForm">
          <div className="ChangePaymentSystemForm__fields">
            <Field
              name="paymentSystem"
              className="ChangePaymentSystemForm__field"
              label={I18n.t('PAYMENT_DETAILS_MODAL.PAYMENT_SYSTEM')}
              placeholder={I18n.t(I18n.t('COMMON.SELECT_OPTION.DEFAULT'))}
              component={FormikSelectField}
              disabled={loading}
            >
              {[
                <option key="NONE" value="NONE">{I18n.t('COMMON.NONE')}</option>,
                ...paymentSystems.map(({ paymentSystem }) => (
                  <option key={paymentSystem} value={paymentSystem}>
                    {paymentSystem}
                  </option>
                )),
                <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
              ]}
            </Field>
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
