import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import compose from 'compose-function';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'constants/propTypes';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik/index';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI/index';
import SymbolsQuery from './graphql/SymbolsQuery';
import { orderTypes } from '../../../../attributes/constants';
import './AccountProfileOrdersGridFilter.scss';

class AccountProfileOrdersGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
    symbolsQuery: PropTypes.query(PropTypes.arrayOf(PropTypes.symbolsTradingEngineType)).isRequired,
  };

  handleSubmit = (values) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm();
  };

  render() {
    const {
      location: { state },
      handleRefetch,
      symbolsQuery,
    } = this.props;

    const symbols = symbolsQuery.data?.tradingEngineSymbols || [];

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
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
                label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__field--large"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="orderType"
                label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.TYPE_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="AccountProfileOrdersGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {orderTypes.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {I18n.t(label)}
                  </option>
                ))}
              </Field>
              <Field
                name="symbol"
                label={I18n.t('TRADING_ENGINE.ACCOUNT_PROFILE.ORDERS.FILTER_FORM.SYMBOL_LABEL')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="AccountProfileOrdersGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {symbols.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Field>
              <Field
                name="openingDateRange"
                className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__date-range"
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
                onClick={handleRefetch}
              />
              <Button
                className="AccountProfileOrdersGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="AccountProfileOrdersGridFilter__button"
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
  }
}

export default compose(
  withRouter,
  withRequests({
    symbolsQuery: SymbolsQuery,
  }),
)(AccountProfileOrdersGridFilter);