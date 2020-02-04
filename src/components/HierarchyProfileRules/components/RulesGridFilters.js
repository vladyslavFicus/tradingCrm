import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { createValidator } from 'utils/validator';
import countryList from 'utils/countryList';
import languages from 'constants/languageNames';
import { filterLabels } from 'constants/user';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { fieldClassNames } from 'components/Formik/constants';
import { decodeNullValues } from 'components/Formik/utils';

const validate = createValidator({
  searchBy: 'string',
  country: `in:,${Object.keys(countryList).join()}`,
  language: 'string',
}, filterLabels, false);

class RulesFilters extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  }

  initialValues = {
    createdByOrUuid: '',
    language: '',
    country: '',
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit(decodeNullValues(values));
    setSubmitting(false);
  };

  onHandleReset = (resetForm) => {
    resetForm(this.initialValues);
    this.props.onReset();
  };

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validate={validate}
        onSubmit={this.onHandleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
        }) => (
          <Form className="filter__form filter__form--row">
            <div className="filter__form-inputs">
              <Field
                name="createdByOrUuid"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('RULES.FILTERS.OPERATOR_OR_RULE')}
                label={I18n.t(filterLabels.searchValue)}
                component={FormikInputField}
              />
              <Field
                name="country"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t(filterLabels.country)}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {Object.keys(countryList).map(key => (
                  <option key={key} value={key}>{countryList[key]}</option>
                ))}
              </Field>
              <Field
                name="language"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                label={I18n.t(filterLabels.language)}
                component={FormikSelectField}
                searchable
                withAnyOption
              >
                {languages.map(({ languageName, languageCode }) => (
                  <option key={languageCode} value={languageCode}>
                    {I18n.t(languageName)}
                  </option>
                ))}
              </Field>
            </div>

            <div className="filter__form-buttons">
              <button
                className="btn btn-default filter__form-button"
                disabled={isSubmitting}
                onClick={() => this.onHandleReset(resetForm)}
                type="button"
              >
                {I18n.t('COMMON.RESET')}
              </button>
              <button
                className="btn btn-primary filter__form-button"
                disabled={isSubmitting}
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

export default RulesFilters;
