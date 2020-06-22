import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
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
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
  };

  initialValues = {
    searchBy: '',
    country: '',
    status: '',
    registrationDateFrom: '',
    registrationDateTo: '',
  }

  handleSubmit = (value, { setSubmitting }) => {
    this.props.onSubmit(decodeNullValues(value));
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
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting, resetForm }) => (
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
                onClick={() => this.onHandleReset(resetForm)}
              >
                {I18n.t('COMMON.RESET')}
              </Button>
              <Button
                primary
                className="margin-left-15"
                disabled={isSubmitting}
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

export default OperatorGridFilter;
