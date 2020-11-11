import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { getAvailableLanguages } from 'config';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import { salesStatuses } from 'constants/salesStatuses';
import { statusesLabels, executionPeriodInHours as executionPeriodInHoursOptions } from 'constants/clientsDistribution';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangeGroup } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import './DistributionRulesGridFilters.scss';

class DistributionRulesFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
  }

  handleSubmit = (filters) => {
    this.props.history.replace({ query: { filters: decodeNullValues(filters) } });
  };

  handleReset = (resetForm) => {
    this.props.history.replace({ query: { filters: {} } });

    resetForm();
  };

  render() {
    const {
      location: { query },
      handleRefetch,
    } = this.props;

    return (
      <Formik
        initialValues={query?.filters || {}}
        onSubmit={this.handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, resetForm, dirty }) => (
          <Form className="DistributionRulesFilters__form">
            <div className="DistributionRulesFilters__fields">
              <Field
                name="searchParam"
                className="DistributionRulesFilters__search"
                placeholder={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY_PLACEHOLDER')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY')}
                component={FormikInputField}
                withFocus
              />
              <Field
                name="ruleStatus"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.RULE_STATUS')}
                component={FormikSelectField}
                withAnyOption
                searchable
                withFocus
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
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SOURCE_BRAND')}
                component={FormikInputField}
                withFocus
              />
              <Field
                name="toBrand"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TARGET_BRAND')}
                component={FormikInputField}
                withFocus
              />
              <Field
                name="salesStatuses"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SALES_STATUS')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {Object.keys(salesStatuses).map(value => (
                  <option key={value} value={value}>
                    {I18n.t(renderLabel(value, salesStatuses))}
                  </option>
                ))}
              </Field>
              <Field
                name="languages"
                className="DistributionRulesFilters__field"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LANGUAGES')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                searchable
                multiple
              >
                {getAvailableLanguages().map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>
              <Field
                name="countries"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.COUNTRY')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
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
                withFocus
              />
              <FormikDateRangeGroup
                className="DistributionRulesFilters__date-range"
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LAST_TIME_EXECUTED')}
                periodKeys={{
                  start: 'lastTimeExecutedFrom',
                  end: 'lastTimeExecutedTo',
                }}
                withFocus
              />
              <Field
                name="executionPeriodsInHours"
                className="DistributionRulesFilters__field"
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TIME_IN_STATUS')}
                component={FormikSelectField}
                searchable
                withFocus
                multiple
              >
                {executionPeriodInHoursOptions.map(({ label, value, i18nValue }) => (
                  <option key={value} value={value}>
                    {I18n.t(label, { value: i18nValue })}
                  </option>
                ))}
              </Field>
            </div>

            <div className="filter__form-buttons">
              <RefreshButton
                className="filter__form-button"
                onClick={handleRefetch}
              />

              <Button
                className="filter__form-button"
                disabled={isSubmitting}
                onClick={() => this.handleReset(resetForm)}
                primary
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="filter__form-button"
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
