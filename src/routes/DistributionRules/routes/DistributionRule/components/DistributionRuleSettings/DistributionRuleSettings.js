import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import { isEqual } from 'lodash';
import { withRequests } from 'apollo';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { executionPeriodInHours as executionPeriodInHoursOptions } from 'constants/clientsDistribution';
import { createValidator } from 'utils/validator';
import { FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import {
  salesStatuses,
  countries,
  periodInHours,
  executionTypes,
} from './constants';
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
      registrationDateRange: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
      lastNotePeriodInHours: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]),
      lastNoteDateRange: PropTypes.shape({
        from: PropTypes.string,
        to: PropTypes.string,
      }),
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
          validate={(values, initialValues) => {
            const errors = createValidator({
              salesStatuses: ['required'],
              targetSalesStatus: ['required'],
              countries: ['required'],
              registrationDateRange: {
                from: ['dateWithTime', `validDateTimeRange:${values?.registrationDateRange?.to}`],
                to: ['dateWithTime'],
              },
              lastNoteDateRange: {
                from: ['dateWithTime', `validDateTimeRange:${values?.lastNoteDateRange?.to}`],
                to: ['dateWithTime'],
              },
              languages: ['required'],
            })(values);

            if (!isEqual(initialValues, values)) {
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
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT')}
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
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                withAnyOption
              >
                {executionPeriodInHoursOptions.map(({ label, value, i18nValue }) => (
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
                className="DistributionRuleSettings__form-field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.REGISTRATION_DATE_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'registrationDateRange.from',
                  to: 'registrationDateRange.to',
                  additional: 'registrationPeriodInHours',
                }}
                additionalValues={periodInHours}
                withAdditionalValues
                withConfirmation
              />
              <Field
                className="DistributionRuleSettings__form-field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.LAST_NOTE_DATE_RANGE')}
                component={FormikDateRangePicker}
                fieldsNames={{
                  from: 'lastNoteDateRange.from',
                  to: 'lastNoteDateRange.to',
                  additional: 'lastNotePeriodInHours',
                }}
                additionalValues={periodInHours}
                anchorDirection="right"
                withAdditionalValues
                withConfirmation
              />
              <Field
                name="affiliateUuids"
                className="DistributionRuleSettings__form-field"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.AFFILIATE')}
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
                className="DistributionRuleSettings__form-field"
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
                {[
                  <option key="UNDEFINED" value="UNDEFINED">{I18n.t('COMMON.OTHER')}</option>,
                  ...countries.map(({ label, value }) => (
                    <option key={value} value={value}>{label}</option>
                  )),
                ]}
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
                {[
                  <option key="undefined" value="undefined">{I18n.t('COMMON.OTHER')}</option>,
                  ...getAvailableLanguages().map(locale => (
                    <option key={locale} value={locale}>
                      {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                    </option>
                  )),
                ]}
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
