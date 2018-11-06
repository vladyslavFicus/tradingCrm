import React, { Component } from 'react';
import { Field, Form, FormSpy } from 'react-final-form';
import PropTypes from 'prop-types';
import { createValidator } from '@newage/backoffice_utils';
import { FilterRow, DateTimeField, RangeGroup } from '@newage/backoffice_ui';
import { I18n } from 'react-redux-i18n';
import Joi from 'joi-browser';
import moment from 'moment';

const schema = Joi.object().keys({
  endDate: Joi.string(),
  startDate: Joi.string(),
});
const validator = createValidator(schema, I18n, 'route.conditionalTags.component.FilterForm');

class FilterForm extends Component {
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    initialFilters: PropTypes.object,
  };

  static defaultProps = {
    disabled: false,
    initialFilters: {},
  };

  startDateValidator = (value, values) => (values && values.endDate
    ? value.isSameOrBefore(moment(values.endDate))
    : value.isSameOrBefore(moment()));

  endDateValidator = (value, values) => (values && values.startDate
    ? value.isSameOrAfter(moment(values.startDate))
    : true);

  handleReset = (formData) => {
    const { onReset } = this.props;

    formData.reset();
    onReset();
  };

  render() {
    const { onSubmit, disabled, initialFilters } = this.props;

    return (
      <Form
        onSubmit={onSubmit}
        validate={validator}
        initialValues={initialFilters}
        keepDirtyOnReinitialize={false}
        render={({ handleSubmit, submitting, pristine }) => (
          <FormSpy subscription={{}}>
            {({ form }) => (
              <FilterRow
                resetBtnLabel={I18n.t('common.reset')}
                submitBtnLabel={I18n.t('common.apply')}
                submitting={submitting}
                className="filter-row"
                disabled={disabled}
                onSubmit={handleSubmit}
                onReset={() => this.handleReset(form)}
                pristine={pristine}
              >
                <FormSpy subscription={{ values: true }}>
                  {({ values }) => (
                    <RangeGroup
                      className="filter-row__dates"
                      label={I18n.t('route.reports.component.FilterForm.dateRange')}
                    >
                      <Field
                        utc
                        name="startDate"
                        placeholder={I18n.t('route.reports.component.FilterForm.placeholders.dateRange.from')}
                        component={DateTimeField}
                        isValidDate={value => this.startDateValidator(value, values)}
                        pickerClassName="left-side"
                      />
                      <Field
                        utc
                        name="endDate"
                        placeholder={I18n.t('route.reports.component.FilterForm.placeholders.dateRange.to')}
                        component={DateTimeField}
                        isValidDate={value => this.endDateValidator(value, values)}
                      />
                    </RangeGroup>
                  )}
                </FormSpy>
              </FilterRow>
            )}
          </FormSpy>
        )}
      />
    );
  }
}

export default FilterForm;
