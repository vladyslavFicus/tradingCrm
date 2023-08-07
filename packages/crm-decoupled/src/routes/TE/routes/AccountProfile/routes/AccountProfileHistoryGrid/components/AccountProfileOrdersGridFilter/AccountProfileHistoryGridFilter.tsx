import React from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import { State } from 'types';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik/index';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components';
import { types } from './constants';
import { SymbolsQueryVariables, useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import './AccountProfileHistoryGridFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const AccountProfileHistoryGridFilter = ({ handleRefetch }: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as State<SymbolsQueryVariables['args']>;

  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 1000000,
        },
      },
    },
  });

  const symbols = symbolsQuery.data?.tradingEngine.symbols?.content || [];

  const handleSubmit = (values: SymbolsQueryVariables['args']) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  return (
    <Formik
      enableReinitialize
      initialValues={state?.filters || {}}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        resetForm,
        values,
        dirty,
      }) => (
        <Form className="AccountProfileHistoryGridFilter">
          <div className="AccountProfileHistoryGridFilter__fields">
            <Field
              name="keyword"
              data-testid="AccountProfileHistoryGridFilter-keywordInput"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              className="AccountProfileHistoryGridFilter__field AccountProfileHistoryGridFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              name="type"
              data-testid="AccountProfileHistoryGridFilter-typeSelect"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.TYPE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountProfileHistoryGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {
                types.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))
              }
            </Field>
            <Field
              name="symbol"
              data-testid="AccountProfileHistoryGridFilter-symbolSelect"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountProfileHistoryGridFilter__field"
              component={FormikSelectField}
              withAnyOption
              searchable
              withFocus
            >
              {
                symbols.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              }
            </Field>
            <Field
              name="openingDateRange"
              className="AccountProfileHistoryGridFilter__field AccountProfileHistoryGridFilter__date-range"
              data-testid="AccountProfileHistoryGridFilter-openingDateRangePicker"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'openingDateRange.from',
                to: 'openingDateRange.to',
              }}
              withFocus
            />
            <Field
              name="closingDateRange"
              className="AccountProfileHistoryGridFilter__field AccountProfileHistoryGridFilter__date-range"
              data-testid="AccountProfileHistoryGridFilter-closingDateRangePicker"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'closingDateRange.from',
                to: 'closingDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="AccountProfileHistoryGridFilter__buttons">
            <RefreshButton
              className="AccountProfileHistoryGridFilter__button"
              data-testid="AccountProfileHistoryGridFilter-refreshButton"
              onClick={handleRefetch}
            />
            <Button
              className="AccountProfileHistoryGridFilter__button"
              data-testid="AccountProfileHistoryGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AccountProfileHistoryGridFilter__button"
              data-testid="AccountProfileHistoryGridFilter-applyButton"
              type="submit"
              disabled={!dirty || isSubmitting}
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

export default React.memo(AccountProfileHistoryGridFilter);
