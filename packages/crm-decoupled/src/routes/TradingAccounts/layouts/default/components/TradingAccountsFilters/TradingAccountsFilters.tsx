import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import useFilter from 'hooks/useFilter';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { Button, RefreshButton } from 'components';
import enumToArray from 'utils/enumToArray';
import {
  AccountTypes,
  AccountTypeLabels,
  AccountStatuses,
} from 'routes/TradingAccounts/constants/tradingAccountsFilters';
import useTradingAccountsFilters from 'routes/TradingAccounts/hooks/useTradingAccountsFilters';
import { FormValues } from 'routes/TradingAccounts/types/tradingAccountsFilters';
import './TradingAccountsFilters.scss';

type Props = {
  onRefetch: () => void,
};

const TradingAccountsFilters = (props: Props) => {
  const { onRefetch } = props;

  // ===== Hooks ===== //
  const {
    platformTypes,
  } = useTradingAccountsFilters();

  const {
    filters,
    handleSubmit,
    handleReset,
  } = useFilter<FormValues>();

  return (
    <Formik
      enableReinitialize
      initialValues={filters}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, resetForm, values, dirty }) => (
        <Form className="TradingAccountsFilters__form">
          <div className="TradingAccountsFilters__fields">
            <Field
              name="searchKeyword"
              label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.SEARCH_BY_PLACEHOLDER')}
              className="TradingAccountsFilters__field"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              name="accountType"
              label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.ACCOUNT_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingAccountsFilters__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {enumToArray(AccountTypes).map(key => (
                <option key={key} value={key}>
                  {I18n.t(AccountTypeLabels[key])}
                </option>
              ))}
            </Field>

            <If condition={platformTypes.length > 1}>
              <Field
                name="platformType"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.PLATFORM_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingAccountsFilters__field"
                component={FormikSelectField}
                withAnyOption
                withFocus
              >
                {platformTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
            </If>

            <Field
              name="archived"
              label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingAccountsFilters__field"
              component={FormikSelectField}
              withAnyOption
              withFocus
            >
              {AccountStatuses.map(({ value, label }) => (
                // @ts-ignore because in tsx file Field can't set BOOLEAN to option value
                <option key={`archived-${value}`} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
          </div>

          <div className="TradingAccountsFilters__buttons">
            <RefreshButton
              className="TradingAccountsFilters__button"
              onClick={onRefetch}
            />

            <Button
              className="TradingAccountsFilters__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>

            <Button
              className="TradingAccountsFilters__button"
              type="submit"
              disabled={isSubmitting || !dirty}
              primary
            >
              {I18n.t('COMMON.APPLY')}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default React.memo(TradingAccountsFilters);
