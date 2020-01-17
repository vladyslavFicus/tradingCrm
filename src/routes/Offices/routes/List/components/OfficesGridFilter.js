import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { filterLabels } from 'constants/user';
import { FormikSelectField, FormikInputField } from 'components/Formik';
import { fieldClassNames } from 'components/Formik/constants';
import countries from 'utils/countryList';

class OfficesGridFilter extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  initialValues = { keyword: '', country: '' };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit(values);
    setSubmitting(false);
  };

  onHandleReset = (resetForm) => {
    resetForm(this.initialValues);
    this.props.onReset();
  }

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        onSubmit={this.onHandleSubmit}
      >
        {({
          submitting,
          resetForm,
        }) => (
          <Form className="filter__form filter__form--row">
            <div className="filter__form-inputs">
              <Field
                name="keyword"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('COMMON.NAME')}
                label={I18n.t(filterLabels.searchValue)}
                component={FormikInputField}
              />
              <Field
                name="country"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t(filterLabels.country)}
                component={FormikSelectField}
                withAnyOption
                searchable
              >
                {Object.keys(countries).map(country => (
                  <option
                    key={`country-${country}`}
                    value={country}
                  >
                    {countries[country]}
                  </option>
                ))}
              </Field>
            </div>

            <div className="filter__form-buttons">
              <button
                className="btn btn-default filter__form-button"
                disabled={submitting}
                onClick={() => this.onHandleReset(resetForm)}
                type="button"
              >
                {I18n.t('COMMON.RESET')}
              </button>
              <button
                className="btn btn-primary filter__form-button"
                disabled={submitting}
                type="submit"
              >
                {I18n.t('COMMON.APPLY')}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default OfficesGridFilter;
