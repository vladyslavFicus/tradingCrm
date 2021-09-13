import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { compose } from 'react-apollo';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import PropTypes from 'constants/propTypes';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangePicker,
} from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import { Button, RefreshButton } from 'components/UI';
import TradingEngineGroupsQuery from './graphql/TradingEngineGroupsQuery';
import './TradingEngineOrdersGridFilter.scss';

class TradingEngineOrdersGridFilter extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
    groups: PropTypes.query({
      tradingEngineGroups: PropTypes.shape({
        groupName: PropTypes.string,
      }),
    }).isRequired,
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
      groups: {
        data: groupsData,
      },
    } = this.props;

    const groups = groupsData?.tradingEngineGroups || [];

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
          <Form className="TradingEngineOrdersGridFilter">
            <div className="TradingEngineOrdersGridFilter__fields">
              <Field
                name="keyword"
                label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY')}
                placeholder={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                className="TradingEngineOrdersGridFilter__field TradingEngineOrdersGridFilter__field--large"
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                withFocus
              />
              <Field
                name="group"
                label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.GROUP')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="TradingEngineOrdersGridFilter__field"
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
              >
                {groups.map(({ groupName }) => (
                  <option key={groupName} value={groupName}>
                    {I18n.t(groupName)}
                  </option>
                ))}
              </Field>
              <Field
                name="openingDateRange"
                className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__date-range"
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
                className="AccountProfileOrdersGridFilter__field AccountProfileOrdersGridFilter__date-range"
                label={I18n.t('TRADING_ENGINE.ORDERS.FILTER_FORM.CLOSE_TIME_RANGE_LABEL')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'closingDateRange.from',
                  to: 'closingDateRange.to',
                }}
                withFocus
              />
            </div>
            <div className="TradingEngineOrdersGridFilter__buttons">
              <RefreshButton
                className="TradingEngineOrdersGridFilter__button"
                onClick={handleRefetch}
              />
              <Button
                className="TradingEngineOrdersGridFilter__button"
                onClick={() => this.handleReset(resetForm)}
                disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="TradingEngineOrdersGridFilter__button"
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
    groups: TradingEngineGroupsQuery,
  }),
)(TradingEngineOrdersGridFilter);
