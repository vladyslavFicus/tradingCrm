import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator, translateLabels } from '../../../../../utils/validator';
import { fulfillmentTypesLabels, statusesLabels, fulfillmentTypes } from '../../../../../constants/bonus-campaigns';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, placeholders } from '../constants';
import { InputField, SelectField, DateTimeField } from '../../../../../components/ReduxForm';
import ordinalizeNumber from '../../../../../utils/ordinalizeNumber';

const FORM_NAME = 'bonusCampaignsFilter';

class BonusCampaignsFilterForm extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    pristine: PropTypes.bool,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
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
    invalid: PropTypes.bool,
    isLoading: PropTypes.bool.isRequired,
    fetchDepositNumbers: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    depositNumbers: PropTypes.array,
  };
  static defaultProps = {
    invalid: true,
    reset: null,
    disabled: false,
    handleSubmit: null,
    pristine: false,
    submitting: false,
    currentValues: {},
    depositNumbers: [],
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

  handleChangeFulfillmentType = (e) => {
    const { change, fetchDepositNumbers } = this.props;
    const fulfillmentType = e.target.value;

    change('fulfillmentType', fulfillmentType);
    if (fulfillmentType === fulfillmentTypes.DEPOSIT) {
      fetchDepositNumbers();
    }
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
      invalid,
      isLoading,
      currentValues,
      depositNumbers,
      locale,
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
                inputAddon={<i className="nas nas-search_icon" />}
                id="campaigns-filters-search"
              />
            </div>
            <div className="filter-row__medium">
              <Field
                name="fulfillmentType"
                label={I18n.t(attributeLabels.fulfillmentType)}
                component={SelectField}
                position="vertical"
                onChange={this.handleChangeFulfillmentType}
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {types.map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, fulfillmentTypesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            {
              currentValues.fulfillmentType === fulfillmentTypes.DEPOSIT &&
              <div className="filter-row__small">
                <Field
                  name="depositNumber"
                  label={I18n.t(attributeLabels.depositNumber)}
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('COMMON.ANY')}</option>
                  {depositNumbers.map(i => (
                    <option key={i} value={i}>
                      {`
                        ${ordinalizeNumber(i, locale)}
                        ${I18n.t('BONUS_CAMPAIGNS.FILTER_FORM.DEPOSIT_NUMBER_OPTION')}
                      `}
                    </option>
                  ))}
                </Field>
              </div>
            }
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
                    utc
                    name="creationDateFrom"
                    component={DateTimeField}
                    showErrorMessage
                    isValidDate={this.startDateValidator('creationDateTo')}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="creationDateTo"
                    component={DateTimeField}
                    showErrorMessage
                    isValidDate={this.endDateValidator('creationDateFrom')}
                    position="vertical"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t(attributeLabels.activityDate)}</label>
                <div className="range-group">
                  <Field
                    utc
                    name="activityDateFrom"
                    placeholder={attributeLabels.startDate}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('activityDateTo')}
                    position="vertical"
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    utc
                    name="activityDateTo"
                    placeholder={attributeLabels.endDate}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('activityDateFrom')}
                    position="vertical"
                  />
                </div>
              </div>
            </div>
            <div className="filter-row__button-block">
              <div className="button-block-container">
                <button
                  disabled={submitting || (disabled && pristine) || isLoading}
                  className="btn btn-default"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting || (disabled && pristine) || invalid || isLoading}
                  className="btn btn-primary"
                  type="submit"
                  id="campaigns-filters-submit"
                >
                  {isLoading && <i className="fa fa-refresh fa-spin" />} {' '}
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
  touchOnChange: true,
  validate: (values, props) => createValidator({
    searchBy: 'string',
    fulfillmentType: ['string', `in:,${props.types.join()}`],
    optIn: 'string',
    state: 'string',
    depositNumber: ['numeric', 'min:1', 'max:10'],
    creationDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    creationDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    activityDateFrom: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
    activityDateTo: 'regex:/^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$/',
  },
  translateLabels(attributeLabels), false)(values),
})(BonusCampaignsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
