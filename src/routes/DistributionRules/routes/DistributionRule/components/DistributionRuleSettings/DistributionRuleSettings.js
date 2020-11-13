import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { executionPeriodInHours as executionPeriodInHoursOptions } from 'constants/clientsDistribution';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import {
  salesStatuses,
  countries,
  registrationPeriodInHours,
  executionTypes,
} from './constants';
import { normalizeObject } from './utils';
import { checkEqualityOfDataObjects } from '../../utils';
import PartnersQuery from './graphql/PartnersQuery';
import './DistributionRuleSettings.scss';

class DistributionRuleSettings extends PureComponent {
  static propTypes = {
    handleGeneralSettings: PropTypes.func.isRequired,
    generalSettings: PropTypes.shape({
      countries: PropTypes.arrayOf(PropTypes.string),
      languages: PropTypes.arrayOf(PropTypes.string),
      salesStatuses: PropTypes.arrayOf(PropTypes.string),
      targetSalesStatus: PropTypes.string,
      firstTimeDeposit: PropTypes.bool,
      affiliateUuids: PropTypes.arrayOf(PropTypes.string),
      registrationPeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      executionType: PropTypes.string,
      executionPeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
    }).isRequired,
    partnersQuery: PropTypes.query({
      partners: PropTypes.pageable(PropTypes.partner),
    }).isRequired,
  }

  render() {
    const {
      handleGeneralSettings,
      generalSettings,
      partnersQuery,
    } = this.props;

    const partners = partnersQuery.data?.partners?.content || [];

    return (
      <div className="DistributionRuleSettings">
        <div className="DistributionRuleSettings__headline">{I18n.t('CLIENTS_DISTRIBUTION.RULE.GENERAL_INFO')}</div>
        <Formik
          initialValues={{
            ...generalSettings,
          }}
          validate={(values) => {
            const errors = createValidator({
              salesStatuses: ['required'],
              targetSalesStatus: ['required'],
              countries: ['required'],
              executionPeriodInHours: ['required'],
              registrationPeriodInHours: ['required'],
              languages: ['required'],
            })(values);

            const valuesAreEqual = checkEqualityOfDataObjects(
              normalizeObject(generalSettings),
              normalizeObject(values),
            );

            if (!valuesAreEqual) {
              handleGeneralSettings(Object.keys(errors).length === 0, values);
            }

            return errors;
          }}
          enableReinitialize
        >
          {() => (
            <Form className="DistributionRuleSettings__form">
              <Field
                name="salesStatuses"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                multipleLabel
                searchable
                multiple
              >
                {salesStatuses.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="targetSalesStatus"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.MIGRATION_STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                searchable
              >
                {salesStatuses.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="executionPeriodInHours"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TIME')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {executionPeriodInHoursOptions.map(({ label, value, i18nValue }) => (
                  <option key={value} value={value}>
                    {I18n.t(label, { value: i18nValue })}
                  </option>
                ))}
              </Field>
              <Field
                name="registrationPeriodInHours"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.REGISTRATION_DATE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {registrationPeriodInHours.map(({ label, value, i18nValue }) => (
                  <option key={value} value={value}>
                    {I18n.t(label, { value: i18nValue })}
                  </option>
                ))}
              </Field>
              <Field
                name="executionType"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TYPE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
              >
                {executionTypes.map(({ label, value }) => (
                  <option key={value} value={value}>{I18n.t(label)}</option>
                ))}
              </Field>
              <Field
                name="affiliateUuids"
                className="DistributionRuleSettings__form-field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABEL.AFFILIATE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                component={FormikSelectField}
                disabled={partnersQuery.loading}
                searchable
                multiple
              >
                {[{ uuid: 'NONE', fullName: 'NONE' }, ...partners].map(({ uuid, fullName }) => (
                  <option key={uuid} value={uuid}>
                    {fullName}
                  </option>
                ))}
              </Field>
              <Field
                name="firstTimeDeposit"
                className="DistributionRulesFilters__field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.FIRST_TIME_DEPOSIT')}
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
                name="countries"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.COUNTRY')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                multipleLabel
                searchable
                multiple
              >
                {countries.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="languages"
                className="DistributionRuleSettings__form-field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LANGUAGE')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                component={FormikSelectField}
                showErrorMessage={false}
                multipleLabel
                searchable
                multiple
              >
                {getAvailableLanguages().map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default withRequests({
  partnersQuery: PartnersQuery,
})(DistributionRuleSettings);
