import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { createValidator } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { categoriesLabels } from '../../../../../constants/files';
import { InputField, SelectField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'userFilesFilter';
const attributeLabels = {
  keyword: 'Search by',
  fileCategory: 'File category',
  uploadDateFrom: 'Start date',
  uploadDateTo: 'End date',
};
const validate = createValidator({
  searchBy: 'string',
  category: 'string',
  uploadDateFrom: 'string',
  uploadDateTo: 'string',
}, attributeLabels, false);

class FilesFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    currentValues: PropTypes.object,
  };

  static defaultProps = {
    currentValues: {},
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DD') : '');
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
  };

  startDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.uploadDateTo
      ? current.isSameOrBefore(moment(currentValues.uploadDateTo))
      : true;
  };

  endDateValidator = (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues.uploadDateFrom
      ? current.isSameOrAfter(moment(currentValues.uploadDateFrom))
      : true;
  };

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <DateTime
        dateFormat="MM/DD/YYYY"
        timeFormat={false}
        onChange={this.handleDateTimeChange(input.onChange)}
        value={input.value ? moment(input.value) : null}
        closeOnSelect
        inputProps={{
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    </div>
  );

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-10">
              <div className="col-md-3">
                <Field
                  name="searchBy"
                  type="text"
                  label={attributeLabels.keyword}
                  labelClassName="form-label"
                  placeholder={'File name, File ID'}
                  component={InputField}
                  position="vertical"
                />
              </div>
              <div className="col-md-2">
                <Field
                  name="fileCategory"
                  label={attributeLabels.fileCategory}
                  labelClassName="form-label"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">Any</option>
                  {Object.keys(categoriesLabels).map(category => (
                    <option key={category} value={category}>
                      {categoriesLabels[category]}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Date range</label>
                  <div className="row">
                    <div className="col-md-5">
                      <Field
                        name="uploadDateFrom"
                        placeholder={attributeLabels.startDate}
                        component={this.renderDateField}
                        isValidDate={this.startDateValidator}
                      />
                    </div>
                    <div className="col-md-5">
                      <Field
                        name="uploadDateTo"
                        placeholder={attributeLabels.endDate}
                        component={this.renderDateField}
                        isValidDate={this.endDateValidator}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  Reset
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
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
  })(FilesFilterForm),
);
