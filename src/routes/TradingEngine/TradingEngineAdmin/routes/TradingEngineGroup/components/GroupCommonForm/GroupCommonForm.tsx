import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { getBrand } from 'config';
import enumToArray from 'utils/enumToArray';
import {
  FormikInputField,
  FormikSelectField,
  FormikCheckbox,
} from 'components/Formik';
import { Group, DefaultLeverage } from '../../types';
import './GroupCommonForm.scss';

interface Props {
  formik: FormikProps<Group>,
}

const GroupCommonForm = ({ formik: { initialValues: { groupName } } }: Props) => (
  <div className="GroupCommonForm">
    <div className="GroupCommonForm__header">
      <div className="GroupCommonForm__title">
        {I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.TITLE')}
      </div>
    </div>
    <div className="GroupCommonForm__fields">
      <Field
        name="enable"
        component={FormikCheckbox}
        label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.ENABLE')}
        className="GroupCommonForm__field GroupCommonForm__field--center"
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.NAME')}
        name="groupName"
        component={FormikInputField}
        type="text"
        className="GroupCommonForm__field"
        disabled={groupName}
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DESCRIPTION')}
        name="description"
        component={FormikInputField}
        type="text"
        className="GroupCommonForm__field"
      />
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DEPOSIT_CURRENCY')}
        name="currency"
        component={FormikSelectField}
        className="GroupCommonForm__field"
        disabled={groupName}
      >
        {getBrand().currencies.supported.map((currenci: string) => (
          <option key={currenci} value={currenci}>
            {currenci}
          </option>
        ))}
      </Field>
      <Field
        label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.LEVERAGE_BY_DEFAULT')}
        name="defaultLeverage"
        component={FormikSelectField}
        className="GroupCommonForm__field"
      >
        {enumToArray(DefaultLeverage).map(key => (
          <option key={DefaultLeverage[key]} value={DefaultLeverage[key]}>
            1:{DefaultLeverage[key]}
          </option>
        ))}
      </Field>
    </div>
  </div>
);

export default React.memo(GroupCommonForm);
