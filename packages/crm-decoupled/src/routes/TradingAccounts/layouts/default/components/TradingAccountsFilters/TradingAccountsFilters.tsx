import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { Utils } from '@crm/common';
import { Button, RefreshButton, FormikSingleSelectField, FormikInputField } from 'components';
import useFilter from 'hooks/useFilter';
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
              withAnyOption
              withFocus
              name="accountType"
              label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.ACCOUNT_TYPE')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingAccountsFilters__field"
              component={FormikSingleSelectField}
              options={Utils.enumToArray(AccountTypes).map(key => ({
                label: I18n.t(AccountTypeLabels[key]),
                value: key,
              }))}
            />

            <If condition={platformTypes.length > 1}>
              <Field
                withAnyOption
                withFocus
                name="platformType"
                label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.PLATFORM_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingAccountsFilters__field"
                component={FormikSingleSelectField}
                options={platformTypes.map(({ value, label }) => ({
                  label,
                  value,
                }))}
              />
            </If>

            <Field
              withAnyOption
              withFocus
              name="archived"
              label={I18n.t('TRADING_ACCOUNTS.FORM.FIELDS.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="TradingAccountsFilters__field"
              component={FormikSingleSelectField}
              options={AccountStatuses.map(({ value, label }) => ({
                label: I18n.t(label),
                value,
              }))}
            />
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
