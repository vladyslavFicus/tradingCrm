import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import moment from 'moment';
import { isEqual } from 'lodash';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { executionPeriodInHours as executionPeriodInHoursOptions } from 'constants/clientsDistribution';
import { createValidator } from 'utils/validator';
import { FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import {
  salesStatuses,
  countries,
  periodInHours,
  periodInDays,
  executionTypes,
} from './constants';
import './DistributionRuleSettings.scss';

const additionalPeriodInDays = [
  {
    label: 'CLIENTS_DISTRIBUTION.RULE.FILTERS.REGISTRATION_TIME.3_DAYS_AGO',
    value: {
      from: moment().subtract(3, 'days').startOf('days'),
      to: moment().subtract(3, 'days').endOf('days'),
    },
  },
];


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
  }

  render() {
    const {
      handleGeneralSettings,
      generalSettings,
    } = this.props;

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

            if (!isEqual(generalSettings, values)) {
              handleGeneralSettings(Object.keys(errors).length === 0, values);
            }

            return errors;
          }}
          enableReinitialize
        >
          {({ values, setValues }) => (
            <Form className="DistributionRuleSettings__form">
              <Field
                name="salesStatuses"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.SALES_STATUS')}
                placeholder={I18n.t('COMMON.SELECT_OPTION.DEFAULT_MULTISELECT')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                customOnChange={(value) => {
                  setValues({
                    ...values,
                    salesStatuses: value && value.sort((a, b) => a.localeCompare(b)),
                  });
                }}
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
                additionalOptions={[...additionalPeriodInDays, ...periodInDays]}
                withAdditionalValues
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
                additionalOptions={periodInDays}
                withAdditionalValues
              />
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
                customOnChange={(value) => {
                  setValues({
                    ...values,
                    countries: value && value.sort((a, b) => a.localeCompare(b)),
                  });
                }}
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
                customOnChange={(value) => {
                  setValues({
                    ...values,
                    languages: value && value.sort((a, b) => a.localeCompare(b)),
                  });
                }}
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

export default DistributionRuleSettings;
