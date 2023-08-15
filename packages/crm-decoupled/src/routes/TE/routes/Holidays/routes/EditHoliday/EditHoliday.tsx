import React from 'react';
import I18n from 'i18n-js';
import { Form, Formik, FormikProps } from 'formik';
import { useParams } from 'react-router-dom';
import { Utils, notify, Types, hasErrorPath } from '@crm/common';
import { ShortLoader } from 'components';
import NotFound from 'routes/NotFound';
import HolidayHeader from '../../components/HolidayHeader';
import HolidayCommonForm from '../../components/HolidayCommonForm';
import HolidaySymbolsGrid from '../../components/HolidaySymbolsGrid';
import { FormValues } from '../../types';
import { useHolidayQuery, HolidayQuery } from './graphql/__generated__/HolidayQuery';
import { useEditHolidayMutation } from './graphql/__generated__/EditHolidayMutation';
import './EditHoliday.scss';

type Holiday = HolidayQuery['tradingEngine']['holiday'];

const validator = Utils.createValidator(
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

const EditHoliday = () => {
  const id = useParams().id as string;

  const holidayQuery = useHolidayQuery({ variables: { id } });
  const [editHoliday] = useEditHolidayMutation();

  const holiday = holidayQuery.data?.tradingEngine.holiday as Holiday;

  const holidayError = hasErrorPath(holidayQuery.error, 'tradingEngine.holiday');

  // ====== Handlers ====== //
  const handleSubmit = async (values: FormValues) => {
    try {
      await editHoliday({ variables: { args: { id, ...values } } });

      notify({
        level: Types.LevelType.SUCCESS,
        title: I18n.t('COMMON.SUCCESS'),
        message: I18n.t('TRADING_ENGINE.HOLIDAY.NOTIFICATION.EDIT.SUCCESS'),
      });
    } catch (_) {
      notify({
        level: Types.LevelType.ERROR,
        title: I18n.t('COMMON.ERROR'),
        message: I18n.t('TRADING_ENGINE.HOLIDAY.NOTIFICATION.EDIT.FAILED'),
      });
    }
  };

  return (
    <div className="EditHoliday">
      <Choose>
        <When condition={holidayQuery.loading}>
          <ShortLoader />
        </When>
        <When condition={holidayError}>
          <NotFound />
        </When>
        <Otherwise>
          <div className="EditHoliday__content">
            <Formik
              enableReinitialize
              validateOnChange={false}
              initialValues={{
                enabled: holiday.enabled,
                description: holiday.description,
                annual: holiday.annual,
                date: holiday.date,
                timeRange: {
                  from: holiday.timeRange.from,
                  to: holiday.timeRange.to,
                },
                symbols: holiday.symbols,
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
        </Otherwise>
      </Choose>
    </div>
  );
};

export default React.memo(EditHoliday);
