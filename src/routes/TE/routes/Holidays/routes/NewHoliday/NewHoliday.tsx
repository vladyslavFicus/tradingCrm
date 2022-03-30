import React from 'react';
import I18n from 'i18n-js';
import compose from 'compose-function';
import { Form, Formik, FormikProps } from 'formik';
import { useHistory } from 'react-router-dom';
import { LevelType, Notify } from 'types';
import { withNotifications } from 'hoc';
import { createValidator } from 'utils/validator';
import HolidayHeader from '../../components/HolidayHeader';
import HolidayCommonForm from '../../components/HolidayCommonForm';
import HolidaySymbolsGrid from '../../components/HolidaySymbolsGrid';
import { FormValues } from '../../types';
import { useCreateHolidayMutation } from './graphql/__generated__/CreateHolidayMutation';
import './NewHoliday.scss';

interface Props {
  notify: Notify,
}

const validator = createValidator(
  {
    description: ['required'],
    date: ['required', 'date'],
    timeRange: {
      from: ['required', 'validTimeRange:timeRange.to'],
    },
  },
  {
    description: I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.DESCRIPTION'),
    date: I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.DATE'),
  },
  false,
);

const NewHoliday = (props: Props) => {
  const { notify } = props;

  const history = useHistory();
  const [createHoliday] = useCreateHolidayMutation();

  // ====== Handlers ====== //
  const handleSubmit = async (values: FormValues) => {
    try {
      const { data } = await createHoliday({ variables: { args: values } });

      const id = data?.tradingEngine.createHoliday.id;

      notify({
        level: LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.HOLIDAY.NOTIFICATION.CREATE.SUCCESS'),
      });

      history.push(`/trading-engine/holidays/${id}`);
    } catch (_) {
      notify({
        level: LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.HOLIDAY.NOTIFICATION.CREATE.FAILED'),
      });
    }
  };

  return (
    <div className="NewHoliday">
      <Formik
        enableReinitialize
        validateOnChange={false}
        initialValues={{
          enabled: true,
          description: '',
          annual: false,
          date: '',
          timeRange: {
            from: '00:00',
            to: '23:59',
          },
          symbols: [],
        }}
        validate={validator}
        onSubmit={handleSubmit}
      >
        {(formik: FormikProps<FormValues>) => (
          <Form>
            <HolidayHeader formik={formik} />
            <HolidayCommonForm />
            <HolidaySymbolsGrid formik={formik} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default compose(
  React.memo,
  withNotifications,
)(NewHoliday);
