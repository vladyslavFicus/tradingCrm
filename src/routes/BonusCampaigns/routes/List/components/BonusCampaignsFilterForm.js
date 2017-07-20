import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator } from '../../../../../utils/validator';
import { campaignTypesLabels, statusesLabels } from '../../../../../constants/bonus-campaigns';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, placeholders } from '../constants';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';

const FORM_NAME = 'bonusCampaignsFilter';
const validator = createValidator({
  searchBy: 'string',
  fulfillmentType: 'string',
  optIn: 'string',
  state: 'string',
  creationDateFrom: 'string',
  creationDateTo: 'string',
  activityDateFrom: 'string',
  activityDateTo: 'string',
}, attributeLabels, false);

class BonusCampaignsFilterForm extends Component {
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
      fulfillmentType: PropTypes.string,
      optIn: PropTypes.string,
      state: PropTypes.string,
      creationDateFrom: PropTypes.string,
      creationDateTo: PropTypes.string,
      activityDateFrom: PropTypes.string,
      activityDateTo: PropTypes.string,
    }),
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      types,
      statuses,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="filter-row">
            <div className="filter-row__big">
              <Field
                name="searchBy"
                type="text"
                label={I18n.t(attributeLabels.searchBy)}
                placeholder={I18n.t(placeholders.searchBy)}
                component={InputField}
                position="vertical"
                iconLeftClassName="nas nas-search_icon"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="fulfillmentType"
                label={I18n.t(attributeLabels.fulfillmentType)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {types.map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, campaignTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="state"
                label={I18n.t(attributeLabels.state)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {statuses.map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, statusesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__small">
              <Field
                name="optIn"
                label={I18n.t(attributeLabels.optIn)}
                component={SelectField}
                position="vertical"
                labelClassName={null}
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                <option value="true">{I18n.t('COMMON.OPT_IN')}</option>
                <option value="false">{I18n.t('COMMON.NON_OPT_IN')}</option>
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t(attributeLabels.creationDate)}</label>
                <div className="range-group">
                  <Field
                    name="creationDateFrom"
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('creationDateTo')}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="creationDateTo"
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('creationDateFrom')}
                    position="vertical"
                    className={null}
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t(attributeLabels.activityDate)}</label>
                <div className="range-group">
                  <Field
                    name="activityDateFrom"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('activityDateTo')}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="activityDateTo"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('activityDateFrom')}
                    position="vertical"
                    className={null}
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
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
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: validator,
})(BonusCampaignsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
