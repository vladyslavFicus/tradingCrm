/* eslint-disable */
import React, { PureComponent } from 'react';
import { Formik, Form, Field } from 'formik';
import { FormikSelectField } from 'components/Formik';
import './RulesSelection.scss';

const mockOptions = [
  {
    value: 'value 1',
    label: 'label 1',
  },
  {
    value: 'value 2',
    label: 'label 2',
  },
  {
    value: 'value 3',
    label: 'label 3',
  },
  {
    value: 'value 4',
    label: 'label 4',
  },
];

class RulesSelection extends PureComponent {
  render() {
    return (
      <div className="RulesSelection">
        <h3 className="mb-3">General information</h3>
        <Formik>
          {({ values }) => (
            <Form className="RulesSelection__form">
              <Field
                name="salesStatus"
                label="Sales status"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field
                name="migrationStatus"
                label="Migration status"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field
                name="country"
                label="Country"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field
                name="executionTime"
                label="Execution time"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field
                name="registrationDate"
                label="Registration date"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Field>
              <Field
                name="executionType"
                label="Execution type"
                className="RulesSelection__form-field"
                component={FormikSelectField}
                multiple
              >
                {mockOptions.map(({ label, value }) => (
                  <option key={value} value={value}>
                    {label}
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

export default RulesSelection;
