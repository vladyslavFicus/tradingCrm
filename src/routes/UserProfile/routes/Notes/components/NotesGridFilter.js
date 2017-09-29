import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import moment from 'moment';
import { createValidator } from '../../../../../utils/validator';
import { InputField, NasSelectField, DateTimeField } from '../../../../../components/ReduxForm';
import { targetTypesLabels } from '../../../../../constants/note';
import renderLabel from '../../../../../utils/renderLabel';

const FORM_NAME = 'userNotesFilter';
const attributeLabels = {
  searchValue: 'Author, targetUUID',
  targetType: 'Target type',
  startDate: 'Start date',
  endDate: 'End date',
};

const validate = (values, props) => createValidator({
  searchValue: 'string',
  startDate: 'string',
  targetType: ['string', `in:,${props.availableTypes.join()}`],
  endDate: 'string',
}, attributeLabels, false);

class NotesGridFilter extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchValue: PropTypes.string,
      targetType: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
    availableTypes: PropTypes.arrayOf(PropTypes.string),
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
      availableTypes,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="searchValue"
                type="text"
                label={'Search by'}
                placeholder={attributeLabels.searchValue}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="targetType"
                label={attributeLabels.targetType}
                position="vertical"
                component={NasSelectField}
                multiple
              >
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {renderLabel(type, targetTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <div className="form-group">
                <label>Creation date range</label>
                <div className="range-group">
                  <Field
                    name="from"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    timeFormat={null}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="to"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    timeFormat={null}
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
  })(NotesGridFilter),
);
