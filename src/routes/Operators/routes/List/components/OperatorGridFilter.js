import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { withRouter } from 'react-router-dom';
import PropTypes from 'constants/propTypes';
import { createValidator, translateLabels } from 'utils/validator';
import countries from 'utils/countryList';
import {
  FormikInputField,
  FormikSelectField,
  FormikDateRangeGroup,
} from 'components/Formik';
import { Button, RefreshButton } from 'components/UI';
import { decodeNullValues } from 'components/Formik/utils';
import { statusesLabels, statuses } from 'constants/operators';
import { attributeLabels } from '../constants';

const validate = createValidator({
  keyword: 'string',
  country: ['string', `in:${Object.keys(countries).join()}`],
  status: ['string', `in:${Object.keys(statuses).join()}`],
}, translateLabels(attributeLabels), false);

class OperatorGridFilter extends Component {
  static propTypes = {
    ...PropTypes.router,
    handleRefetch: PropTypes.func.isRequired,
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
      handleRefetch,
      location: { state },
    } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        validate={validate}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting, resetForm, dirty }) => (
          <Form className="filter__form">
            <div className="filter__form-inputs">
              <Field
                name="searchBy"
                label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.SEARCH_BY')}
                placeholder={I18n.t(attributeLabels.keyword)}
                component={FormikInputField}
                addition={<i className="icon icon-search" />}
                className="filter-row__medium"
                withFocus
              />
              <Field
                name="country"
                searchable
                label={I18n.t(attributeLabels.country)}
                component={FormikSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                withFocus
              >
                {Object.keys(countries).map(key => (
                  <option key={key} value={key}>{countries[key]}</option>
                ))}
              </Field>
              <Field
                name="status"
                searchable
                label={I18n.t(attributeLabels.status)}
                component={FormikSelectField}
                placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
                className="filter-row__medium"
                withFocus
              >
                {Object.keys(statusesLabels).map(status => (
                  <option key={status} value={status}>
                    {I18n.t(statusesLabels[status])}
                  </option>
                ))}
              </Field>
              <FormikDateRangeGroup
                className="form-group filter-row__big"
                label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_RANGE')}
                periodKeys={{
                  start: 'registrationDateFrom',
                  end: 'registrationDateTo',
                }}
                withFocus
              />
            </div>
            <div className="filter__form-buttons">
              <RefreshButton
                onClick={handleRefetch}
              />
              <Button
                primary
                disabled={isSubmitting}
                onClick={() => this.handleReset(resetForm)}
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                primary
                disabled={isSubmitting || !dirty}
                type="submit"
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

export default withRouter(OperatorGridFilter);
