import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { filterFormAttributeLabels } from '../constants';
import { createValidator } from '../../../../../../../utils/validator';
import PropTypes from '../../../../../../../constants/propTypes';
import { typesLabels } from '../../../../../../../constants/audit';
import { InputField, SelectField, DateTimeField } from '../../../../../../../components/ReduxForm';

const FORM_NAME = 'userFeedFilter';
const validate = createValidator({
  searchBy: 'string',
  actionType: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
}, filterFormAttributeLabels, false);

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
            <div className="filter-row__big">
              <Field
                name="searchBy"
                type="text"
                label={I18n.t(filterFormAttributeLabels.searchBy)}
                placeholder={I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="actionType"
                label={I18n.t(filterFormAttributeLabels.actionType)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_TYPE_EMPTY_OPTION')}</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>
                  {I18n.t('OPERATOR_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
                </label>
                <div className="range-group">
                  <Field
                    name="creationDateFrom"
                    placeholder={I18n.t(filterFormAttributeLabels.creationDateFrom)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="creationDateTo"
                    placeholder={I18n.t(filterFormAttributeLabels.creationDateTo)}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator}
                    position="vertical"
                    className={null}
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
                  disabled={submitting}
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FeedFilterForm)
);
