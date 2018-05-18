import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator, translateLabels } from '../../../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../../../utils/renderLabel';
import { fulfillmentTypesLabels } from '../../../../../../../../../../constants/bonus-campaigns';
import { attributeLabels, attributePlaceholders } from './constants';
import { InputField, SelectField, DateTimeField, RangeGroup } from '../../../../../../../../../../components/ReduxForm';

class CampaignsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    currentValues: PropTypes.shape({
      searchBy: PropTypes.string,
      assign: PropTypes.string,
      providerId: PropTypes.string,
      gameId: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  };
  static defaultProps = {
    reset: null,
    handleSubmit: null,
    submitting: false,
    pristine: false,
    disabled: false,
    currentValues: null,
  };

  startDateValidator = toAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[toAttribute]
      ? current.isSameOrBefore(moment(currentValues[toAttribute]))
      : true;
  };

  endDateValidator = fromAttribute => (current) => {
    const { currentValues } = this.props;

    return currentValues && currentValues[fromAttribute]
      ? current.isSameOrAfter(moment(currentValues[fromAttribute]))
      : true;
  };

  handleReset = () => {
    this.props.reset();
    this.props.onReset();
  };

  render() {
    const {
      submitting,
      pristine,
      disabled,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <form className="filter-row" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="searchBy"
          type="text"
          label={I18n.t(attributeLabels.searchBy)}
          placeholder={I18n.t(attributePlaceholders.searchBy)}
          component={InputField}
          inputAddon={<i className="icon icon-search" />}
          className="filter-row__big"
        />
        <Field
          name="bonusType"
          label={I18n.t(attributeLabels.bonusType)}
          component={SelectField}
          className="filter-row__medium"
        >
          <option value="">{I18n.t('COMMON.ANY')}</option>
          {Object.keys(fulfillmentTypesLabels).map(item => (
            <option key={item} value={item}>
              {renderLabel(item, fulfillmentTypesLabels)}
            </option>
          ))}
        </Field>
        <RangeGroup
          className="filter-row__dates"
          label={I18n.t(attributeLabels.availabilityDateRange)}
        >
          <Field
            utc
            name="activityDateFrom"
            placeholder={I18n.t(attributeLabels.activityDateFrom)}
            component={DateTimeField}
            isValidDate={this.startDateValidator('activityDateTo')}
          />
          <Field
            utc
            name="activityDateTo"
            placeholder={I18n.t(attributeLabels.activityDateTo)}
            component={DateTimeField}
            isValidDate={this.endDateValidator('activityDateFrom')}
          />
        </RangeGroup>
        <div className="filter-row__button-block">
          <button
            disabled={submitting || (disabled && pristine)}
            className="btn btn-default"
            onClick={this.handleReset}
            type="reset"
          >
            {I18n.t('COMMON.RESET')}
          </button>
          <button
            disabled={submitting || (disabled && pristine)}
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

const FORM_NAME = 'campaignsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    searchBy: 'string',
    bonusType: 'string',
    activityDateFrom: 'string',
    activityDateTo: 'string',
  }, translateLabels(attributeLabels), false),
})(CampaignsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
