import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { createValidator } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { typesLabels } from '../../../../../constants/audit';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';

const FORM_NAME = 'userFeedFilter';
const attributeLabels = {
  searchBy: 'Search by',
  actionType: 'Action types',
  creationDateFrom: 'Creation date from',
  creationDateTo: 'Creation date to',
};
const validate = createValidator({
  searchBy: 'string',
  actionType: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
}, attributeLabels, false);

class FeedFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    currentValues: PropTypes.object,
    availableTypes: PropTypes.arrayOf(PropTypes.string),
  };
  static defaultProps = {
    currentValues: {},
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.creationDateTo
      ? current.isSameOrBefore(moment(currentValues.creationDateTo))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.creationDateFrom
      ? current.isSameOrAfter(moment(currentValues.creationDateFrom))
      : true;
  };

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      availableTypes,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="searchBy"
                type="text"
                label={attributeLabels.searchBy}
                placeholder={'Action ID, Operator ID, IP'}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="actionType"
                label={attributeLabels.actionType}
                component={SelectField}
                position="vertical"
              >
                <option value="">All actions</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {renderLabel(type, typesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>Action date range</label>
                <div className="range-group">
                  <Field
                    name="creationDateFrom"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="creationDateTo"
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FeedFilterForm),
);
