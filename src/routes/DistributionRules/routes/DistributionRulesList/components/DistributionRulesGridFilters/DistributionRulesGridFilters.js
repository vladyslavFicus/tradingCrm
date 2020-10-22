import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { createValidator } from 'utils/validator';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import { filterLabels } from 'constants/user';
import { salesStatuses } from 'constants/salesStatuses';
import { statusesLabels, executionPeriodInHours as executionPeriodInHoursOptions } from 'constants/clientsDistribution';
import Button from 'components/UI/Button';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import './DistributionRulesGridFilters.scss';

const validate = createValidator({
  searchBy: 'string',
  country: `in:,${Object.keys(countryList).join()}`,
}, filterLabels, false);

class DistributionRulesFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
  }

  handleFiltersChanged = (filters, { setSubmitting }) => {
    this.props.history.replace({ query: { filters: decodeNullValues(filters) } });

    setSubmitting(false);
  };

  render() {
    return (
      <Formik
        initialValues={{}}
        validate={validate}
        onSubmit={this.handleFiltersChanged}
        onReset={this.handleFiltersChanged}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="DistributionRulesFilters__form">
            <div className="DistributionRulesFilters__fields">
              <Field
                name="searchParam"
                className="DistributionRulesFilters__search"
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY_PLACEHOLDER')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY')}
                component={FormikInputField}
              />
              <Field
                name="ruleStatus"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.RULE_STATUS')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(statusesLabels).map(status => (
                  <option key={status} value={status}>
                    {I18n.t(statusesLabels[status])}
                  </option>
                ))}
              </Field>
              <Field
                name="fromBrand"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.FROM_BRAND')}
                component={FormikInputField}
              />
              <Field
                name="toBrand"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TO_BRAND')}
                component={FormikInputField}
              />
              <Field
                name="salesStatus"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SALES_STATUS')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(salesStatuses).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(renderLabel(value, salesStatuses))}
                  </option>
                ))}
              </Field>
              <Field
                name="country"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t(filterLabels.country)}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(countryList).map(key => (
                  <option key={key} value={key}>{countryList[key]}</option>
                ))}
              </Field>
              <FormikDateRangeGroup
                className="DistributionRulesFilters__date-range"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.CREATED_TIME')}
                periodKeys={{
                  start: 'createdDateFrom',
                  end: 'createdDateTo',
                }}
              />
              <FormikDateRangeGroup
                className="DistributionRulesFilters__date-range"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LAST_TIME_EXECUTED')}
                periodKeys={{
                  start: 'lastTimeExecutedFrom',
                  end: 'lastTimeExecutedTo',
                }}
              />
              <Field
                name="executionPeriodInHours"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.EXECUTION_TIME')}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {executionPeriodInHoursOptions.map(({ label, value, i18nValue }) => (
                  <option key={value} value={value}>
                    {I18n.t(label, { value: i18nValue })}
                  </option>
                ))}
              </Field>
            </div>

            <div className="filter__form-buttons">
              <Button
                className="btn btn-default filter__form-button"
                disabled={isSubmitting}
                onClick={resetForm}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                className="btn btn-primary filter__form-button"
                disabled={isSubmitting || !dirty}
                type="submit"
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

export default withRouter(DistributionRulesFilters);
