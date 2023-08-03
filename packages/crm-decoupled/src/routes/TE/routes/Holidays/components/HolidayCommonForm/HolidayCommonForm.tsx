import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import {
  FormikInputField,
  FormikCheckbox,
  FormikDatePicker,
  FormikTimeRangeField,
} from 'components/Formik';
import './HolidayCommonForm.scss';

const HolidayCommonForm = () => (
  <div className="HolidayCommonForm">
    <div className="HolidayCommonForm__header">
      <div className="HolidayCommonForm__title">
        {I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.TITLE')}
      </div>
    </div>
    <div className="HolidayCommonForm__fields">
      <Field
        name="enabled"
        data-testid="HolidayCommonForm-enabledCheckbox"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.ENABLE')}
        className="HolidayCommonForm__field HolidayCommonForm__field"
      />
    </div>
    <div className="HolidayCommonForm__fields">
      <Field
        name="description"
        type="text"
        data-testid="HolidayCommonForm-descriptionInput"
        label={I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.DESCRIPTION')}
        component={FormikInputField}
        className="HolidayCommonForm__field HolidayCommonForm__field--large"
      />
    </div>
    <div className="HolidayCommonForm__fields">
      <Field
        name="annual"
        data-testid="HolidayCommonForm-annualCheckbox"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.EVERY_YEAR')}
        className="HolidayCommonForm__field HolidayCommonForm__field--checkbox-center"
      />
      <Field
        name="date"
        className="HolidayCommonForm__field"
        data-testid="HolidayCommonForm-datePicker"
        label={I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.DATE')}
        component={FormikDatePicker}
      />
      <Field
        className="HolidayCommonForm__field"
        data-testid="HolidayCommonForm-timeRange"
        component={FormikTimeRangeField}
        fieldsNames={{
          from: 'timeRange.from',
          to: 'timeRange.to',
        }}
        fieldsLabels={{
          from: I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.TIME_FROM'),
          to: I18n.t('TRADING_ENGINE.HOLIDAY.COMMON_HOLIDAY_FORM.TIME_TO'),
        }}
      />
    </div>
  </div>
);

export default React.memo(HolidayCommonForm);
