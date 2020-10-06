import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
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
import './MigrationSettings.scss';

class MigrationSettings extends PureComponent {
  static propTypes = {
    handleGeneralSettings: PropTypes.func.isRequired,
    generalSettings: PropTypes.object.isRequired,
  }

  render() {
    const {
      handleGeneralSettings,
      generalSettings,
    } = this.props;

    return (
      <div className="MigrationSettings">
        <div className="MigrationSettings__headline">General information</div>
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

            handleGeneralSettings(Object.keys(errors).length === 0, values);

            return errors;
          }}
          enableReinitialize
        >
          {() => (
            <Form className="MigrationSettings__form">
              <Field
                name="salesStatuses"
                label="Sales status"
                className="MigrationSettings__form-field"
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
                label="Migration status"
                className="MigrationSettings__form-field"
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
                label="Country"
                className="MigrationSettings__form-field"
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
                label="Execution time"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {executionPeriodInHours.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="registrationPeriodInHours"
                label="Registration date"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {registrationPeriodInHours.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="executionType"
                label="Execution type"
                className="MigrationSettings__form-field"
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

export default MigrationSettings;
