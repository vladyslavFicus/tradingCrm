import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import { createValidator } from 'utils/validator';
import { FormikSelectField } from 'components/Formik';
import {
  salesStatus,
  migrationStatus,
  countries,
  executionTime,
  registrationDate,
  executionType,
} from './constants';
import './MigrationSettings.scss';

class MigrationSettings extends PureComponent {
  static propTypes = {
    handleGeneralSettings: PropTypes.func.isRequired,
    generalSettings: PropTypes.object,
  }

  static defaultProps = {
    generalSettings: {},
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
              salesStatus: ['required'],
              migrationStatus: ['required'],
              country: ['required'],
              executionTime: ['required'],
              registrationDate: ['required'],
            })(values);

            handleGeneralSettings(Object.keys(errors).length === 0, values);

            return errors;
          }}
          enableReinitialize
        >
          {() => (
            <Form className="MigrationSettings__form">
              <Field
                name="salesStatus"
                label="Sales status"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                searchable
                multiple
              >
                {salesStatus.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="migrationStatus"
                label="Migration status"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
                searchable
              >
                {migrationStatus.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="country"
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
                name="executionTime"
                label="Execution time"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {executionTime.map(({ label, value }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Field>
              <Field
                name="registrationDate"
                label="Registration date"
                className="MigrationSettings__form-field"
                component={FormikSelectField}
                showErrorMessage={false}
              >
                {registrationDate.map(({ label, value }) => (
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
