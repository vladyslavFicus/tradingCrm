import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from 'utils/validator';
import PropTypes from 'constants/propTypes';
import { statuses, statusesLabels } from 'constants/files';
import { InputField, SelectField, DateTimeField, RangeGroup } from 'components/ReduxForm';
import { attributeLabels } from '../constants';

class FileListFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    invalid: PropTypes.bool,
  };

  static defaultProps = {
    currentValues: {},
    invalid: true,
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
      invalid,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t(attributeLabels.keyword)}
          placeholder="Name, UUID"
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="documentStatus"
          label={I18n.t(attributeLabels.documentStatus)}
          component={SelectField}
          className="filter-row__small"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(statuses).map(value => (
            <option key={value} value={value}>
              {I18n.t(statusesLabels[value])}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('FILES.FILTER.UPLOAD_DATA_RANGE')}
        >
          <Field
            name="uploadDateFrom"
            placeholder={I18n.t(attributeLabels.uploadDateFrom)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            timeFormat={null}
            pickerClassName="left-side"
          />
          <Field
            name="uploadDateTo"
            placeholder={I18n.t(attributeLabels.uploadDateTo)}
            component={DateTimeField}
            isValidDate={this.endDateValidator}
            timeFormat={null}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting}
            className="btn btn-default"
            onClick={this.handleReset}
            type="button"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || invalid}
            className="btn btn-primary"
            type="submit"
          >
            {I18n.t('COMMON.APPLY')}
          </button>
        </div>
      </form>
    );
  }
}

const FORM_NAME = 'userFilesFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(reduxForm({
  form: FORM_NAME,
  touchOnChange: true,
  validate: createValidator({
    searchBy: 'string',
    uploadDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    uploadDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
  }, translateLabels(attributeLabels), false),
})(FileListFilterForm));
