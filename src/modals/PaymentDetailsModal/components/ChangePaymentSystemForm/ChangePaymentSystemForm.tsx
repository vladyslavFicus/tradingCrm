import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { MutationOptions, MutationResult, QueryResult } from 'react-apollo';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import { Notify, LevelType } from 'types/notify';
import { FormikSelectField } from 'components/Formik';
import { Button } from 'components/UI';
import UpdatePaymentSystemMutation from './graphql/UpdatePaymentSystemMutation';
import PaymentSystemsQuery from './graphql/PaymentSystemsQuery';
import './ChangePaymentSystemForm.scss';

interface FormValues {
  paymentSystem: string,
}

interface PaymentSystemsData {
  paymentSystems: {
    paymentSystem: string,
  }[],
}

interface UpdatePaymentSystemResponse {
  changePaymentSystem: null,
}

interface Props {
  paymentId: string,
  notify: Notify,
  onSuccess: () => void,
  paymentSystemsQuery: QueryResult<PaymentSystemsData>,
  updatePaymentSystem: (options: MutationOptions) => MutationResult<UpdatePaymentSystemResponse>,
}

class ChangePaymentSystemForm extends PureComponent<Props> {
  handleSubmit = async ({ paymentSystem }: FormValues) => {
    const {
      onSuccess,
      paymentId,
      notify,
      updatePaymentSystem,
    } = this.props;

    try {
      await updatePaymentSystem({ variables: { paymentId, paymentSystem } });

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
  }

  render() {
    const {
      paymentSystemsQuery: {
        data,
        loading,
      },
    } = this.props;

    const paymentSystems = data?.paymentSystems || [];

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
        onSubmit={this.handleSubmit}
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
  }
}

export default compose(
  withNotifications,
  withRequests({
    updatePaymentSystem: UpdatePaymentSystemMutation,
    paymentSystemsQuery: PaymentSystemsQuery,
  }),
)(ChangePaymentSystemForm);
