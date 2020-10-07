import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import {
  salesStatuses,
  countries,
  executionPeriodInHours,
  registrationPeriodInHours,
  executionType,
} from './constants';
import './DistributionRuleSettings.scss';

class DistributionRuleSettings extends PureComponent {
  static propTypes = {
    handleGeneralSettings: PropTypes.func.isRequired,
    generalSettings: PropTypes.object.isRequired,
  }

  /**
   * The entry and output objects of the form values may contain the same props,
   * but in a different arrange, so very important to bring them in the same order
   * to make the right comparison of them
   */
  static normalizeObject = obj => Object.keys(obj).sort().reduce((acc, cur) => ({
    ...acc,
    [cur]: obj[cur].sort ? [...obj[cur]].sort() : obj[cur],
  }), {});

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
            executionType: 'MANUAL',
            ...generalSettings,
          }}
          validate={(values) => {
            const errors = createValidator({
              salesStatuses: ['required'],
              targetSalesStatus: ['required'],
              countries: ['required'],
              executionPeriodInHours: ['required'],
              registrationPeriodInHours: ['required'],
            })(values);

            const { normalizeObject } = DistributionRuleSettings;
            const valuesAreEqual = JSON.stringify(normalizeObject(generalSettings))
              === JSON.stringify(normalizeObject(values));

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
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
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
                name="countries"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.COUNTRY')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                searchable
                multiple
              >
                {countries.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="executionPeriodInHours"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TIME')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {executionPeriodInHours.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="registrationPeriodInHours"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.REGISTRATION_DATE')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {registrationPeriodInHours.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="executionType"
                label={I18n.t('CLIENTS_DISTRIBUTION.RULE.FILTERS_LABELS.EXECUTION_TYPE')}
                className="DistributionRuleSettings__form-field"
                component={FormikSelectField}
              >
                {executionType.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}

export default DistributionRuleSettings;
