import React, { Component } from 'react';
import I18n from 'i18n-js';
import { Formik, Form, Field } from 'formik';
import { createValidator, translateLabels } from 'utils/validator';
import { FormikInputField, FormikSelectField, FormikDateRangePicker } from 'components/Formik';
import { Button } from 'components/UI';
import PropTypes from 'constants/propTypes';
import { typesLabels } from 'constants/audit';
import { filterFormAttributeLabels as attributeLabels } from '../../constants';
import './OperatorsFeedFilter.scss';

const validate = createValidator({
  searchBy: 'string',
  auditLogType: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
}, translateLabels(attributeLabels), false);

class OperatorsFeedFilter extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    availableTypes: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    availableTypes: [],
  };

  onHandleSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit(values);
    setSubmitting(false);
  };

  onHandleReset = (resetForm) => {
    resetForm(this.initialValues);
    this.props.onSubmit();
  };

  render() {
    const { availableTypes } = this.props;

    return (
      <Formik
        className="OperatorsFeedFilter"
        initialValues={{
          searchBy: '',
          auditLogType: '',
          creationDateFrom: '',
          creationDateTo: '',
        }}
        onSubmit={this.onHandleSubmit}
        validate={validate}
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="OperatorsFeedFilter__form">
            <Field
              name="searchBy"
              className="OperatorsFeedFilter__input OperatorsFeedFilter__search"
              label={I18n.t(attributeLabels.searchBy)}
              placeholder={I18n.t('PARTNERS.GRID_FILTERS.SEARCH_BY_PLACEHOLDER')}
              component={FormikInputField}
            />

            <Field
              name="auditLogType"
              className="OperatorsFeedFilter__input OperatorsFeedFilter__select"
              label={I18n.t(attributeLabels.actionType)}
              component={FormikSelectField}
            >
              {
                [
                  <option value="" key="any">
                    {I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_TYPE_EMPTY_OPTION')}
                  </option>,
                  ...availableTypes.map(type => (
                    <option key={type} value={type}>
                      {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                    </option>
                  )),
                ]
              }
            </Field>

            <FormikDateRangePicker
              className="OperatorsFeedFilter__input OperatorsFeedFilter__dates"
              label={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
              periodKeys={{
                start: 'creationDateFrom',
                end: 'creationDateTo',
              }}
            />

            <div className="OperatorsFeedFilter__buttons">
              <Button
                className="OperatorsFeedFilter__button"
                onClick={() => this.onHandleReset(resetForm)}
                disabled={isSubmitting}
                common
              >
                {I18n.t('COMMON.RESET')}
              </Button>

              <Button
                className="OperatorsFeedFilter__button"
                disabled={isSubmitting}
                type="submit"
                primary
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

export default OperatorsFeedFilter;
