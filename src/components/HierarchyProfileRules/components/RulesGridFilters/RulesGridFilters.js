import React, { Component } from 'react';
import PropTypes from 'constants/propTypes';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRouter } from 'react-router-dom';
import { getAvailableLanguages } from 'config';
import { createValidator } from 'utils/validator';
import countryList from 'utils/countryList';
import { filterLabels } from 'constants/user';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { fieldClassNames } from 'components/Formik/constants';
import { decodeNullValues } from 'components/Formik/utils';

const validate = createValidator({
  searchBy: 'string',
  country: `in:,${Object.keys(countryList).join()}`,
  language: 'string',
  operators: 'string',
  partners: 'string',
}, filterLabels, false);

class RulesFilters extends Component {
  static propTypes = {
    ...PropTypes.router,
    partners: PropTypes.partnersList,
    operators: PropTypes.operatorsList,
    type: PropTypes.string,
  }

  static defaultProps = {
    type: null,
    partners: [],
    operators: [],
  };

  handleReset = (resetForm) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: null,
      },
    });

    resetForm({});
  };

  handleSubmit = (values, { setSubmitting }) => {
    const { history, location: { state } } = this.props;

    history.replace({
      state: {
        ...state,
        filters: decodeNullValues(values),
      },
    });

    setSubmitting(false);
  };

  render() {
    const {
      partners,
      operators,
      type,
      location: { state },
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        validate={validate}
        onSubmit={this.handleSubmit}
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="filter__form filter__form--row">
            <div className="filter__form-inputs">
              <Field
                name="createdByOrUuid"
                className={fieldClassNames.MEDIUM}
                placeholder={I18n.t('RULES.FILTERS.RULE')}
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
                {getAvailableLanguages().map(locale => (
                  <option key={locale} value={locale}>
                    {I18n.t(`COMMON.LANGUAGE_NAME.${locale.toUpperCase()}`, { defaultValue: locale.toUpperCase() })}
                  </option>
                ))}
              </Field>
              <If condition={partners && type !== 'PARTNER'}>
                <Field
                  name="affiliateId"
                  className={fieldClassNames.MEDIUM}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('RULES.FILTERS.PARTNER')}
                  component={FormikSelectField}
                  searchable
                  withAnyOption
                >
                  {partners.map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>
                      {I18n.t(fullName)}
                    </option>
                  ))}
                </Field>
              </If>
              <If condition={operators && type !== 'OPERATOR'}>
                <Field
                  name="operatorUuids"
                  className={fieldClassNames.MEDIUM}
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('RULES.FILTERS.OPERATOR')}
                  component={FormikSelectField}
                  searchable
                  multiple
                >
                  {operators.map(({ uuid, fullName }) => (
                    <option key={uuid} value={uuid}>
                      {I18n.t(fullName)}
                    </option>
                  ))}
                </Field>
              </If>
            </div>

            <div className="filter__form-buttons">
              <button
                className="btn btn-default filter__form-button"
                disabled={isSubmitting}
                onClick={() => this.handleReset(resetForm)}
                type="button"
              >
                {I18n.t('COMMON.RESET')}
              </button>
              <button
                className="btn btn-primary filter__form-button"
                disabled={isSubmitting || !dirty}
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

export default withRouter(RulesFilters);
