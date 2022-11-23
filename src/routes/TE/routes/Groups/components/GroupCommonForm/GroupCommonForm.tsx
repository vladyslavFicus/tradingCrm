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
import { FormValues, DefaultLeverage } from '../../types';
import './GroupCommonForm.scss';

type Props = {
  formik: FormikProps<FormValues>,
}

const GroupCommonForm = (props: Props) => {
  const { formik: { initialValues: { groupName, enabled } } } = props;

  const archived = !enabled;

  return (
    <div className="GroupCommonForm">
      <div className="GroupCommonForm__header">
        <div className="GroupCommonForm__title">
          {I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.TITLE')}
        </div>
      </div>
      <div className="GroupCommonForm__fields">
        <Field
          name="accountCreationAllowed"
          component={FormikCheckbox}
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.ACCOUNT_CREATION_ALLOWED')}
          className="GroupCommonForm__field GroupCommonForm__field--center"
          disabled={archived}
        />
        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.NAME')}
          name="groupName"
          component={FormikInputField}
          type="text"
          className="GroupCommonForm__field"
          disabled={!!groupName || archived}
        />
        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DESCRIPTION')}
          name="description"
          component={FormikInputField}
          type="text"
          className="GroupCommonForm__field"
          disabled={archived}
        />
        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DEPOSIT_CURRENCY')}
          name="currency"
          component={FormikSelectField}
          className="GroupCommonForm__field"
          disabled={!!groupName || archived}
        >
          {getBrand().currencies.supported.map((currency: string) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Field>
        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.LEVERAGE_BY_DEFAULT')}
          name="defaultLeverage"
          component={FormikSelectField}
          className="GroupCommonForm__field"
          disabled={archived}
        >
          {enumToArray(DefaultLeverage).map(value => (
            <option key={value} value={value}>
              1:{value}
            </option>
          ))}
        </Field>
      </div>
    </div>
  );
};

export default React.memo(GroupCommonForm);
