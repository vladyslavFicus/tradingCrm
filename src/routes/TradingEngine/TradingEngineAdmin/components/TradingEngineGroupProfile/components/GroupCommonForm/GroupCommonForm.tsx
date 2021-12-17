import React from 'react';
import I18n from 'i18n-js';
import { Field } from 'formik';
import {
  FormikInputField,
  FormikSelectField,
  FormikCheckbox,
} from 'components/Formik';
import { CURRENCIES, DEFAULT_LEVERAGES } from '../../constants';
import './GroupCommonForm.scss';

const GroupCommonForm = () => (
  <div className="GroupCommonForm">
    <div className="GroupCommonForm__header">
      <div className="GroupCommonForm__title">
        {I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.TITLE')}
      </div>
    </div>
    <div className="GroupCommonForm__fields">
      <Field
        name="enable"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.ENABLE')}
        className="GroupCommonForm__field"
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.NAME')}
        name="groupName"
        component={FormikInputField}
        type="text"
        className="GroupCommonForm__field"
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.DESCRIPTION')}
        name="description"
        component={FormikInputField}
        type="text"
        className="GroupCommonForm__field"
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.DEPOSIT_CURRENCE')}
        name="currency"
        component={FormikSelectField}
        className="GroupCommonForm__field"
      >
        {CURRENCIES.map(currenci => (
          <option key={currenci} value={currenci}>
            {currenci}
          </option>
        ))}
      </Field>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP_PROFILE.COMMON_GROUP_FORM.LEVERAGE_BY_DEFAULT')}
        name="defaultLeverage"
        component={FormikSelectField}
        className="GroupCommonForm__field"
      >
        {DEFAULT_LEVERAGES.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(GroupCommonForm);
