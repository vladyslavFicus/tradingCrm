import React from 'react';
import I18n from 'i18n-js';
import { Field, FormikProps } from 'formik';
import { Config, Utils } from '@crm/common';
import { FormikSingleSelectField, FormikInputField, FormikCheckbox } from 'components';
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
          data-testid="GroupCommonForm-accountCreationAllowedCheckbox"
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
          data-testid="GroupCommonForm-groupNameInput"
          disabled={!!groupName || archived}
        />

        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DESCRIPTION')}
          name="description"
          component={FormikInputField}
          type="text"
          className="GroupCommonForm__field"
          data-testid="GroupCommonForm-descriptionInput"
          disabled={archived}
        />

        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.DEPOSIT_CURRENCY')}
          name="currency"
          data-testid="GroupCommonForm-currencySelect"
          component={FormikSingleSelectField}
          className="GroupCommonForm__field"
          disabled={!!groupName || archived}
          options={Config.getBrand().currencies.supported.map((currency: string) => ({
            label: currency,
            value: currency,
          }))}
        />

        <Field
          label={I18n.t('TRADING_ENGINE.GROUP.COMMON_GROUP_FORM.LEVERAGE_BY_DEFAULT')}
          name="defaultLeverage"
          component={FormikSingleSelectField}
          className="GroupCommonForm__field"
          data-testid="GroupCommonForm-defaultLeverageSelect"
          disabled={archived}
          options={Utils.enumToArray(DefaultLeverage).map(value => ({
            label: `1:${value}`,
            value,
          }))}
        />
      </div>
    </div>
  );
};

export default React.memo(GroupCommonForm);
