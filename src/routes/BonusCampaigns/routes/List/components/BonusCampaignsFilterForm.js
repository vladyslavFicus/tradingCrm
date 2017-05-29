import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator } from '../../../../../utils/validator';
import { eventTypesLabels, statusesLabels } from '../../../constants';
import renderLabel from '../../../../../utils/renderLabel';
import { attributeLabels, placeholders } from '../constants';
import { SelectField, SearchField, DateTimeField } from '../../../../../components/ReduxForm';

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-2">
                  <Field
                    name="searchBy"
                    type="text"
                    label={I18n.t(attributeLabels.searchBy)}
                    placeholder={I18n.t(placeholders.searchBy)}
                    component={SearchField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="fulfillmentType"
                    label={I18n.t(attributeLabels.fulfillmentType)}
                    component={SelectField}
                    position="vertical"
                    labelClassName={null}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {types.map(item => (
                      <option key={item} value={item}>
                        {renderLabel(item, eventTypesLabels)}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-1">
                  <Field
                    name="state"
                    label={I18n.t(attributeLabels.state)}
                    component={SelectField}
                    position="vertical"
                    labelClassName={null}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {statuses.map(item => (
                      <option key={item} value={item}>
                        {renderLabel(item, statusesLabels)}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-1">
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
                <div className="col-md-3">
                  <div className="form-group">
                    <label>{I18n.t(attributeLabels.creationDate)}</label>

                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="creationDateFrom"
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.startDateValidator('creationDateTo')}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="creationDateTo"
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.endDateValidator('creationDateFrom')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>{I18n.t(attributeLabels.activityDate)}</label>

                    <div className="row">
                      <div className="col-md-5">
                        <Field
                          name="activityDateFrom"
                          placeholder={attributeLabels.startDate}
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.startDateValidator('activityDateTo')}
                        />
                      </div>
                      <div className="col-md-5">
                        <Field
                          name="activityDateTo"
                          placeholder={attributeLabels.endDate}
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.endDateValidator('activityDateFrom')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-offset-9 col-md-3 text-right">
              <div className="form-group">
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting || (disabled && pristine)}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
                  type="submit"
                >
                  {I18n.t('COMMON.APPLY')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
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
