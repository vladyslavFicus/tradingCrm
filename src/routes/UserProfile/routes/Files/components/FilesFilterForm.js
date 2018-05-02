import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { categoriesLabels } from '../../../../../constants/files';
import { attributeLabels } from '../constants';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';

class FilesFilterForm extends Component {
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
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="searchBy"
                type="text"
                label={I18n.t(attributeLabels.keyword)}
                placeholder={'File name, File ID'}
                component={InputField}
                position="vertical"
                inputAddon={<i className="icon icon-search" />}
              />
            </div>
            <div className="filter-row__small">
              <Field
                name="fileCategory"
                label={I18n.t(attributeLabels.fileCategory)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {Object.keys(categoriesLabels).map(category => (
                  <option key={category} value={category}>
                    {categoriesLabels[category]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>
                  {I18n.t('PLAYER_PROFILE.FILES.FILTER_FORM.LABEL.DATE_RANGE')}
                </label>
                <div className="range-group">
                  <Field
                    name="uploadDateFrom"
                    placeholder={I18n.t(attributeLabels.uploadDateFrom)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    timeFormat={null}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="uploadDateTo"
                    placeholder={I18n.t(attributeLabels.uploadDateTo)}
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
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const FORM_NAME = 'userFilesFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
    validate: createValidator({
      searchBy: 'string',
      category: 'string',
      uploadDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
      uploadDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}$/',
    }, translateLabels(attributeLabels), false),
  })(FilesFilterForm),
);
