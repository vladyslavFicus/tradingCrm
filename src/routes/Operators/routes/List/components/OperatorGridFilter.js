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
  FormikDateRangePicker,
} from 'components/Formik';
import { Button } from 'components/UI';
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
    const { location: { state } } = this.props;

    return (
      <Formik
        enableReinitialize
        initialValues={state?.filters || {}}
        validate={validate}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting, resetForm, dirty }) => (
          <Form className="filter-row">
            <Field
              name="searchBy"
              label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.SEARCH_BY')}
              placeholder={I18n.t(attributeLabels.keyword)}
              component={FormikInputField}
              inputAddon={<i className="icon icon-search" />}
              className="filter-row__medium"
            />
            <Field
              name="country"
              searchable
              label={I18n.t(attributeLabels.country)}
              component={FormikSelectField}
              placeholder={I18n.t('COMMON.SELECT_OPTION.ANY')}
              className="filter-row__medium"
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
            >
              {Object.keys(statusesLabels).map(status => (
                <option key={status} value={status}>
                  {I18n.t(statusesLabels[status])}
                </option>
              ))}
            </Field>
            <div className="form-group filter-row__medium">
              <FormikDateRangePicker
                label={I18n.t('OPERATORS.LIST.FILTER_FORM.LABEL.REGISTRATION_DATE_RANGE')}
                periodKeys={{
                  start: 'registrationDateFrom',
                  end: 'registrationDateTo',
                }}
              />
            </div>
            <div className="filter-row__button-block">
              <Button
                common
                disabled={isSubmitting}
                onClick={() => this.handleReset(resetForm)}
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                primary
                className="margin-left-15"
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
