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
import { TransactionsQueryVariables } from '../../graphql/__generated__/TransactionsQuery';
import { types } from './constants';
import './AccountProfileTransactionsGridFilter.scss';

type Props = {
  handleRefetch: () => void,
};

const AccountProfileTransactionsGrid = ({ handleRefetch }: Props) => {
  const navigate = useNavigate();
  const state = useLocation().state as Types.State<TransactionsQueryVariables['args']>;

  const handleSubmit = (values: TransactionsQueryVariables['args']) => {
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
              data-testid="AccountProfileTransactionsGrid-keywordInput"
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
              name="transactionType"
              data-testid="AccountProfileTransactionsGrid-transactionTypeSelect"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.TYPE_LABEL')}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="AccountProfileOrdersGridFilter__field"
              component={FormikSingleSelectField}
              options={types.map(({ value, label }) => ({
                label: I18n.t(label),
                value,
              }))}
            />

            <Field
              name="creationDateRange"
              className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__date-range"
              data-testid="AccountProfileTransactionsGrid-creationDateRangePicker"
              label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.TRANSACTION_TIME_RANGE_LABEL')}
              component={FormikDateRangePicker}
              fieldsNames={{
                from: 'creationDateRange.from',
                to: 'creationDateRange.to',
              }}
              withFocus
            />
          </div>
          <div className="AccountProfileOrdersGridFilter__buttons">
            <RefreshButton
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileTransactionsGrid-refreshButton"
              onClick={handleRefetch}
            />
            <Button
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileTransactionsGrid-resethButton"
              onClick={() => handleReset(resetForm)}
              disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
              primary
            >
              {I18n.t('COMMON.RESET')}
            </Button>
            <Button
              className="AccountProfileOrdersGridFilter__button"
              data-testid="AccountProfileTransactionsGrid-applyButton"
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

export default React.memo(AccountProfileTransactionsGrid);
