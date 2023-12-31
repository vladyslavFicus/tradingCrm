import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Utils, Types } from '@crm/common';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  RefreshButton,
  FormikSingleSelectField,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { orderTypes } from '../../../../attributes/constants';
import { useSymbolsQuery, SymbolsQueryVariables } from './graphql/__generated__/SymbolsQuery';
import './AccountProfileOrdersGridFilter.scss';

type Props = {
  onRefresh: () => void,
};

const AccountProfileOrdersGridFilter = ({ onRefresh }: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as Types.State<SymbolsQueryVariables>;

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

  const symbols = symbolsQuery.data?.tradingEngine.symbols.content || [];

  const handleSubmit = (values: SymbolsQueryVariables['args']) => {
    navigate('.', {
      replace: true,
      state: {
        ...state,
        filters: Utils.decodeNullValues(values),
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
        <Form className="AccountProfileOrdersGridFilter">
          <div className="AccountProfileOrdersGridFilter__fields">
            <Field
              name="keyword"
              data-testid="AccountProfileOrdersGridFilter-keywordInput"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />
            <Field
              withAnyOption
              searchable
              withFocus
              name="orderType"
              data-testid="AccountProfileOrdersGridFilter-orderTypeSelect"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.TYPE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountProfileOrdersGridFilter__field"
              component={FormikSingleSelectField}
              options={orderTypes.map(({ value, label }) => ({
                label: I18n.t(label),
                value,
              }))}
            />
            <Field
              withAnyOption
              searchable
              withFocus
              name="symbol"
              data-testid="AccountProfileOrdersGridFilter-symbolSelect"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountProfileOrdersGridFilter__field"
              component={FormikSingleSelectField}
              options={symbols.map(({ symbol }) => ({
                label: symbol,
                value: symbol,
              }))}
            />
            <Field
              name="openingDateRange"
              className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__date-range"
              data-testid="AccountProfileOrdersGridFilter-openingDateRangePicker"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'openingDateRange.from',
                to: 'openingDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="AccountProfileOrdersGridFilter__buttons">
            <RefreshButton
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileOrdersGridFilter-refreshButton"
              onClick={onRefresh}
            />
            <Button
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileOrdersGridFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileOrdersGridFilter-applyButton"
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

export default React.memo(AccountProfileOrdersGridFilter);
