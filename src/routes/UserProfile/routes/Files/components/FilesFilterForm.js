import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { createValidator } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { categoriesLabels } from '../../../../../constants/files';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';

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
                name="searchBy"
                type="text"
                label={attributeLabels.keyword}
                placeholder={'File name, File ID'}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__small">
              <Field
                name="fileCategory"
                label={attributeLabels.fileCategory}
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
            <div className="filter-row__big">
              <div className="form-group">
                <label>Date range</label>
                <div className="range-group">
                  <Field
                    name="uploadDateFrom"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    timeFormat={null}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="uploadDateTo"
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
  })(FilesFilterForm),
);
