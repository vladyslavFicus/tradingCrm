import React, { PureComponent } from 'react';
import compose from 'compose-function';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { salesStatuses } from 'constants/salesStatuses';
import { statusesLabels, timeInCurrentStatusInHours } from 'constants/clientsDistribution';
import countryList from 'utils/countryList';
import renderLabel from 'utils/renderLabel';
import FiltersToggler from 'components/FiltersToggler';
import { Button, RefreshButton } from 'components/UI';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import PartnersQuery from './graphql/PartnersQuery';
import './DistributionRulesGridFilters.scss';

class DistributionRulesFilters extends PureComponent {
  static propTypes = {
    ...PropTypes.router,
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partner),
    }).isRequired,
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
      partnersQuery,
      handleRefetch,
    } = this.props;

    const partners = partnersQuery.data?.partners?.content || [];

    return (
      <FiltersToggler>
        <Formik
          initialValues={query?.filters || {}}
          onSubmit={this.handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, resetForm, dirty }) => (
            <Form className="DistributionRulesFilters__form">
              <div className="DistributionRulesFilters__fields">
                <Field
                  name="searchParam"
                  className="DistributionRulesFilters__field DistributionRulesFilters__search"
                  placeholder={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY_PLACEHOLDER')}
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SEARCH_BY')}
                  component={FormikInputField}
                  withFocus
                />
                <Field
                  name="ruleStatus"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
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
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  placeholder={I18n.t('COMMON.NAME')}
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.SOURCE_BRAND')}
                  component={FormikInputField}
                  withFocus
                />
                <Field
                  name="toBrand"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  placeholder={I18n.t('COMMON.NAME')}
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TARGET_BRAND')}
                  component={FormikInputField}
                  withFocus
                />
                <Field
                  name="salesStatuses"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
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
                  name="affiliateUuids"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.AFFILIATE')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  disabled={partnersQuery.loading}
                  searchable
                  withFocus
                  multiple
                >
                  {[{ uuid: 'NONE', fullName: 'NONE' }, ...partners].map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>
                      {fullName}
                    </option>
                  ))}
                </Field>
                <Field
                  name="languages"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LANGUAGES')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  searchable
                  multiple
                >
                  {[
                    <option key="undefined" value="undefined">{I18n.t('COMMON.OTHER')}</option>,
                    ...getAvailableLanguages().map(locale => (
                      <option key={locale} value={locale}>
                        {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                      </option>
                    )),
                  ]}
                </Field>
                <Field
                  name="countries"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.COUNTRY')}
                  component={FormikSelectField}
                  searchable
                  withFocus
                  multiple
                >
                  {[
                    <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                    ...Object.keys(countryList)
                      .map(country => (
                        <option key={country} value={country}>{countryList[country]}</option>
                      )),
                  ]}
                </Field>
                <Field
                  name="firstTimeDeposit"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.FIRST_TIME_DEPOSIT')}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  component={FormikSelectField}
                  withAnyOption
                >
                  {
                    [
                      { label: 'COMMON.NO', value: false },
                      { label: 'COMMON.YES', value: true },
                    ].map(({ label, value }) => (
                      <option key={`firstTimeDeposit-${value}`} value={value}>
                        {I18n.t(label)}
                      </option>
                    ))
                  }
                </Field>
                <Field
                  className="DistributionRulesFilters__field DistributionRulesFilters__date-range"
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.CREATED_TIME')}
                  component={FormikDateRangePicker}
                  fieldsNames={{
                    from: 'createdDateFrom',
                    to: 'createdDateTo',
                  }}
                  withFocus
                />
                <Field
                  name="executionPeriodsInHours"
                  className="DistributionRulesFilters__field DistributionRulesFilters__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.TIME_IN_STATUS')}
                  component={FormikSelectField}
                  searchable
                  withFocus
                  multiple
                >
                  {timeInCurrentStatusInHours.map(({ label, value, i18nValue }) => (
                    <option key={value} value={value}>
                      {I18n.t(label, { value: i18nValue })}
                    </option>
                  ))}
                </Field>
                <Field
                  className="DistributionRulesFilters__field DistributionRulesFilters__date-range"
                  label={I18n.t('CLIENTS_DISTRIBUTION.FILTERS.LAST_TIME_EXECUTED')}
                  component={FormikDateRangePicker}
                  fieldsNames={{
                    from: 'lastTimeExecutedFrom',
                    to: 'lastTimeExecutedTo',
                  }}
                  withFocus
                />
              </div>

              <div className="filter__form-buttons">
                <RefreshButton
                  className="filter__form-button"
                  onClick={handleRefetch}
                />

                <Button
                  className="filter__form-button"
                  disabled={isSubmitting || (!dirty && !Object.keys(values).length)}
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
      </FiltersToggler>
    );
  }
}

export default compose(
  withRouter,
  withRequests({
    partnersQuery: PartnersQuery,
  }),
)(DistributionRulesFilters);
