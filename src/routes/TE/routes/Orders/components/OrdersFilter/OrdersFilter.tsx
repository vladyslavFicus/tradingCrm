import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { State } from 'types';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import { statuses } from '../../attributes/constants';
import { useGroupsQuery } from './graphql/__generated__/GroupsQuery';
import { useSymbolsQuery } from './graphql/__generated__/SymbolsQuery';
import './OrdersFilter.scss';

interface Props {
  onRefresh: () => void,
}

interface FormValues {
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

  const history = useHistory();
  const { state } = useLocation<State<FormValues>>();
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
    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  const handleReset = (resetForm: Function) => {
    history.replace({
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
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY')}
              placeholder={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
              className="OrdersFilter__field OrdersFilter__field--large"
              component={FormikInputField}
              addition={<i className="icon icon-search" />}
              withFocus
            />

            <Field
              name="groups"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.GROUP')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OrdersFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              multiple
            >
              {groups.map(({ groupName }) => (
                <option key={groupName} value={groupName}>
                  {I18n.t(groupName)}
                </option>
              ))}
            </Field>
            <Field
              name="orderStatuses"
              className="OrdersFilter__field"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.STATUS')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              component={FormikSelectField}
              withFocus
              withAnyOption
            >
              {statuses.map(({ value, label }) => (
                <option key={value} value={value}>
                  {I18n.t(label)}
                </option>
              ))}
            </Field>
            <Field
              name="symbol"
              label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SYMBOL_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="OrdersFilter__field"
              component={FormikSelectField}
              searchable
              withFocus
              disabled={symbolsQuery.loading}
            >
              {symbols.map(({ symbol }) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </Field>
            <Field
              name="openingDateRange"
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
              onClick={onRefresh}
            />
            <Button
              className="OrdersFilter__button"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="OrdersFilter__button"
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
