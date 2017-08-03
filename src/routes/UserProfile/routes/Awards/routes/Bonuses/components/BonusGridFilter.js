import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { InputField, SelectField, DateTimeField } from '../../../../../../../components/ReduxForm';
import { statusesLabels, typesLabels, assignLabels } from '../../../../../../../constants/bonus';
import { createValidator } from '../../../../../../../utils/validator';
import renderLabel from '../../../../../../../utils/renderLabel';

const FORM_NAME = 'userBonusesFilter';
const attributeLabels = {
  keyword: 'Bonus ID, Bonus name, Granted by...',
  assigned: 'Assigned by',
  states: 'Bonus status',
  type: 'Bonus type',
  startDate: 'Start date',
  endDate: 'End date',
};
const validator = createValidator({
  keyword: 'string',
  assigned: 'string',
  states: 'string',
  type: 'string',
  startDate: 'string',
  endDate: 'string',
}, attributeLabels, false);

class BonusGridFilter extends Component {
  static propTypes = {
    playerUUID: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    currentValues: PropTypes.object,
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
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="keyword"
                type="text"
                label={'Search by'}
                placeholder={attributeLabels.keyword}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="assigned"
                label={attributeLabels.assigned}
                component={SelectField}
                position="vertical"
              >
                <option value="">Anyone</option>
                {Object.keys(assignLabels).map(assign => (
                  <option key={assign} value={assign}>
                    {renderLabel(assign, assignLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="type"
                label={attributeLabels.type}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any type</option>
                {Object.keys(typesLabels).map(type => (
                  <option key={type} value={type}>
                    {renderLabel(type, typesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="states"
                label={attributeLabels.states}
                component={SelectField}
                position="vertical"
              >
                <option value="">Any status</option>
                {Object.keys(statusesLabels).map(status => (
                  <option key={status} value={status}>
                    {renderLabel(status, statusesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>Availability date range</label>
                <div className="range-group">
                  <Field
                    name="startDate"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="endDate"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    position="vertical"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary"
                  type="submit"
                  id="bonus-filters-apply-button"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(BonusGridFilter);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
