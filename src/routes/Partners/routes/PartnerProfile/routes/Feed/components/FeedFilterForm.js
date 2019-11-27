import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import I18n from 'i18n-js';
import { filterFormAttributeLabels as attributeLabels } from '../constants';
import { createValidator, translateLabels } from '../../../../../../../utils/validator';
import PropTypes from '../../../../../../../constants/propTypes';
import { typesLabels } from '../../../../../../../constants/audit';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../../../../components/ReduxForm';

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
    handleSubmit: null,
    reset: null,
    availableTypes: [],
    submitting: false,
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
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t(attributeLabels.searchBy)}
          placeholder={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.SEARCH_BY_PLACEHOLDER')}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="auditLogType"
          label={I18n.t(attributeLabels.actionType)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_TYPE_EMPTY_OPTION')}</option>
          {availableTypes.map(type => (
            <option key={type} value={type}>
              {typesLabels[type] ? I18n.t(typesLabels[type]) : type}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t('PARTNER_PROFILE.FEED.FILTER_FORM.ACTION_DATE_RANGE')}
        >
          <Field
            name="creationDateFrom"
            placeholder={I18n.t(attributeLabels.creationDateFrom)}
            component={DateTimeField}
            isValidDate={this.startDateValidator}
            pickerClassName="left-side"
          />
          <Field
            name="creationDateTo"
            placeholder={I18n.t(attributeLabels.creationDateTo)}
            component={DateTimeField}
            isValidDate={this.endDateValidator}
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
            disabled={submitting}
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

const FORM_NAME = 'UserFeedFilter';

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate: createValidator({
      searchBy: 'string',
      auditLogType: 'string',
      creationDateFrom: 'string',
      creationDateTo: 'string',
    }, translateLabels(attributeLabels), false),
  })(FeedFilterForm),
);
