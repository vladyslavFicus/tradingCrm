import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { getAvailableLanguages } from 'config';
import PropTypes from 'constants/propTypes';
import { filterLabels } from 'constants/user';
import { createValidator } from 'utils/validator';
import { statuses as operatorsStasuses } from 'constants/operators';
import { Button } from 'components/UI';
import { FormikInputField, FormikSelectField } from 'components/Formik';
import { decodeNullValues } from 'components/Formik/utils';
import countryList from 'utils/countryList';
import './RulesGridFilter.scss';

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
    partners: null,
    operators: null,
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
        className="RulesGridFilter"
        initialValues={state?.filters || {}}
        onSubmit={this.handleSubmit}
        validate={validate}
        enableReinitialize
      >
        {({
          isSubmitting,
          resetForm,
          dirty,
        }) => (
          <Form className="RulesGridFilter__form">
            <div className="RulesGridFilter__fields">
              <Field
                name="createdByOrUuid"
                className="RulesGridFilter__field RulesGridFilter__search"
                placeholder={I18n.t('RULES.FILTERS.RULE')}
                label={I18n.t(filterLabels.searchValue)}
                component={FormikInputField}
              />
              <Field
                name="country"
                className="RulesGridFilter__field RulesGridFilter__select"
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
                className="RulesGridFilter__field RulesGridFilter__select"
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
                  className="RulesGridFilter__field RulesGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('RULES.FILTERS.PARTNER')}
                  component={FormikSelectField}
                  disabled={partners.length === 0}
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
                  className="RulesGridFilter__field RulesGridFilter__select"
                  placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                  label={I18n.t('RULES.FILTERS.OPERATORS')}
                  component={FormikSelectField}
                  disabled={operators.length === 0}
                  searchable
                  multiple
                >
                  {operators.map(({ uuid, fullName, operatorStatus }) => (
                    <option
                      key={uuid}
                      value={uuid}
                      className={classNames({
                        'color-inactive': operatorStatus !== operatorsStasuses.ACTIVE,
                      })}
                    >
                      {I18n.t(fullName)}
                    </option>
                  ))}
                </Field>
              </If>
            </div>

            <div className="RulesGridFilter__buttons">
              <Button
                common
                className="RulesGridFilter__button"
                disabled={isSubmitting}
                onClick={() => this.handleReset(resetForm)}
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                primary
                type="submit"
                className="RulesGridFilter__button"
                disabled={isSubmitting || !dirty}
              >
                {I18n.t('COMMON.APPLY')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default withRouter(RulesFilters);
