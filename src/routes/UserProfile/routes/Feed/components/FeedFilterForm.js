import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import PropTypes from '../../../../../constants/propTypes';
import { typesLabels } from '../../../../../constants/audit';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels } from '../constants';

class FeedFilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    availableTypes: PropTypes.arrayOf(PropTypes.string),
    invalid: PropTypes.bool,
  };
  static defaultProps = {
    currentValues: {},
    availableTypes: [],
    invalid: true,
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
      invalid,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="searchBy"
                type="text"
                label={I18n.t(attributeLabels.searchBy)}
                placeholder={'Action ID, Operator ID, IP'}
                component={InputField}
                position="vertical"
                inputAddon={<i className="nas nas-search_icon" />}
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="actionType"
                label={I18n.t(attributeLabels.actionType)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ALL_ACTIONS')}</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {renderLabel(type, typesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>
                  {I18n.t('PLAYER_PROFILE.FEED.FILTER_FORM.LABELS.ACTION_DATE_RANGE')}
                </label>
                <div className="range-group">
                  <Field
                    utc
                    name="creationDateFrom"
                    placeholder={I18n.t(attributeLabels.creationDateFrom)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="creationDateTo"
                    placeholder={I18n.t(attributeLabels.creationDateTo)}
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

const FORM_NAME = 'userFeedFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    touchOnChange: true,
    validate: createValidator({
      searchBy: 'string',
      actionType: 'string',
      creationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
      creationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    }, translateLabels(attributeLabels), false),
  })(FeedFilterForm),
);
