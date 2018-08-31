import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { reduxForm, Field, getFormValues } from 'redux-form';
import {
  InputField,
  SelectField,
  DateTimeField,
  RangeGroup,
  NasSelectField,
} from '../../../../../../../../../components/ReduxForm';
import {
  types,
  statusesLabels,
  typesLabels,
  assignLabels,
} from '../../../../../../../../../constants/bonus';
import { attributeLabels } from '../constants';
import { createValidator, translateLabels } from '../../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../../utils/renderLabel';

class BonusGridFilter extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    currentValues: PropTypes.shape({
      keyword: PropTypes.string,
      assigned: PropTypes.string,
      type: PropTypes.string,
      states: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    invalid: PropTypes.bool.isRequired,
  };
  static defaultProps = {
    currentValues: {},
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.endDate
      ? current.isSameOrBefore(moment(currentValues.endDate))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.startDate
      ? current.isSameOrAfter(moment(currentValues.startDate))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      invalid,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="keyword"
          type="text"
          label="Search by"
          placeholder={I18n.t(attributeLabels.keyword)}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="assigned"
          label={I18n.t(attributeLabels.assigned)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">Anyone</option>
          {Object.keys(assignLabels).map(assign => (
            <option key={assign} value={assign}>
              {renderLabel(assign, assignLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="types"
          label={I18n.t(attributeLabels.type)}
          component={NasSelectField}
          multiple
          className="filter-row__medium"
        >
          {Object.keys(types).map(type => (
            <option key={type} value={type}>
              {renderLabel(type, typesLabels)}
            </option>
          ))}
        </Field>
        <Field
          name="states"
          label={I18n.t(attributeLabels.states)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">Any status</option>
          {Object.keys(statusesLabels).map(status => (
            <option key={status} value={status}>
              {renderLabel(status, statusesLabels)}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t(attributeLabels.availabilityDateRange)}
        >
          <Field
            name="startDate"
            placeholder={I18n.t(attributeLabels.startDate)}
            component={DateTimeField}
            timeFormat={null}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
          />
          <Field
            name="endDate"
            placeholder={I18n.t(attributeLabels.endDate)}
            component={DateTimeField}
            timeFormat={null}
            isValidDate={this.endDateValidator}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || invalid}
            className="btn btn-primary"
            type="submit"
            id="bonus-filters-apply-button"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'userBonusesFilter';

const FilterForm = reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    keyword: 'string',
    assigned: 'string',
    states: 'string',
    types: 'array',
    startDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    endDate: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  }, translateLabels(attributeLabels), false),
})(BonusGridFilter);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
