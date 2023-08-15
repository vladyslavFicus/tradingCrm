import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Utils, Types } from '@crm/common';
import { Formik, Form, Field } from 'formik';
import {
  Button,
  FormikSingleSelectField,
  FormikMultipleSelectField,
  RefreshButton,
  FormikInputField,
  FormikDateRangePicker,
} from 'components';
import { statuses } from '../../attributes/constants';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import './OrdersFilter.scss';

type Props = {
  onRefresh: () => void,
}

type FormValues = {
  keyword?: string,
  orderStatuses?: string[],
  symbol?: string,
  openingDateRange?: {
    from?: string,
    to?: string,
  },
  closingDateRange?: {
    from?: string,
    to?: string,
  },
}

const OrdersFilter = (props: Props) => {
  const { onRefresh } = props;

  const navigate = useNavigate();
  const state = useLocation().state as Types.State<FormValues>;
  const groupsQuery = useGroupsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 100000,
        },
      },
    },
  });

  const symbolsQuery = useSymbolsQuery({
    variables: {
      args: {
        page: {
          from: 0,
          size: 100000,
        },
      },
    },
  });

  const groups = groupsQuery.data?.tradingEngine.groups.content || [];
  const symbols = symbolsQuery.data?.tradingEngine.symbols.content || [];

  // ===== Handlers ===== //
  const handleSubmit = (values: FormValues) => {
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
        <Form className="OrdersFilter">
          <div className="OrdersFilter__fields">
            <Field
              name="keyword"
              data-testid="OrdersFilter-keywordInput"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              className="OrdersFilter__field OrdersFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              searchable
              withFocus
              name="groups"
              data-testid="OrdersFilter-groupsSelect"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.GROUP')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OrdersFilter__field"
              component={FormikMultipleSelectField}
              options={groups.map(({ groupName }) => ({
                label: I18n.t(groupName),
                value: groupName,
              }))}
            />
            <Field
              withFocus
              withAnyOption
              name="orderStatuses"
              data-testid="OrdersFilter-orderStatusesSelect"
              className="OrdersFilter__field"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSingleSelectField}
              options={statuses.map(({ value, label }) => ({
                label: I18n.t(label),
                value,
              }))}
            />
            <Field
              searchable
              withFocus
              withAnyOption
              name="symbol"
              data-testid="OrdersFilter-symbolSelect"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OrdersFilter__field"
              component={FormikSingleSelectField}
              disabled={symbolsQuery.loading}
              options={symbols.map(({ symbol }) => ({
                label: symbol,
                value: symbol,
              }))}
            />
            <Field
              name="openingDateRange"
              data-testid="OrdersFilter-openingDateRangePicker"
              className="OrdersFilter__field OrdersFilter__date-range"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.OPEN_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'openingDateRange.from',
                to: 'openingDateRange.to',
              }}
              withFocus
            />
            <Field
              name="closingDateRange"
              data-testid="OrdersFilter-closingDateRangePicker"
              className="OrdersFilter__field OrdersFilter__date-range"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'closingDateRange.from',
                to: 'closingDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="OrdersFilter__buttons">
            <RefreshButton
              className="OrdersFilter__button"
              data-testid="OrdersFilter-refreshButton"
              onClick={onRefresh}
            />
            <Button
              className="OrdersFilter__button"
              data-testid="OrdersFilter-resetButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="OrdersFilter__button"
              data-testid="OrdersFilter-applyButton"
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

export default React.memo(OrdersFilter);
