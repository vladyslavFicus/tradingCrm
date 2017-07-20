import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getFormValues, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import { createValidator } from '../../../../../../../../utils/validator';
import renderLabel from '../../../../../../../../utils/renderLabel';
import { campaignTypesLabels } from '../../../../../../../../constants/bonus-campaigns';
import { attributeLabels, attributePlaceholders } from './constants';
import { SelectField, SearchField, DateTimeField } from '../../../../../../../../components/ReduxForm';

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="row">
            <div className="col-md-10">
              <div className="row">
                <div className="col-md-3">
                  <Field
                    name="searchBy"
                    label={I18n.t(attributeLabels.searchBy)}
                    placeholder={I18n.t(attributePlaceholders.searchBy)}
                    component={SearchField}
                  />
                </div>
                <div className="col-md-2">
                  <Field
                    name="bonusType"
                    label={I18n.t(attributeLabels.bonusType)}
                    labelClassName="form-label"
                    position="vertical"
                    component={SelectField}
                  >
                    <option value="">{I18n.t('COMMON.ANY')}</option>
                    {Object.keys(campaignTypesLabels).map(item => (
                      <option key={item} value={item}>
                        {renderLabel(item, campaignTypesLabels)}
                      </option>
                    ))}
                  </Field>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>{I18n.t(attributeLabels.availabilityDateRange)}</label>

                    <div className="row">
                      <div className="col-md-6">
                        <Field
                          name="activityDateFrom"
                          placeholder={I18n.t(attributeLabels.activityDateFrom)}
                          component={DateTimeField}
                          position="vertical"
                          isValidDate={this.startDateValidator('activityDateTo')}
                        />
                      </div>
                      <div className="col-md-6">
                        <Field
                          name="activityDateTo"
                          placeholder={I18n.t(attributeLabels.activityDateTo)}
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

            <div className="col-md-2 text-right">
              <div className="form-group margin-top-25">
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

const validatorAttributeLabels = Object.keys(attributeLabels).reduce((res, name) => ({
  ...res,
  [name]: I18n.t(attributeLabels[name]),
}), {});
const FORM_NAME = 'campaignsFilter';
const FilterForm = reduxForm({
  form: FORM_NAME,
  validate: createValidator({
    searchBy: 'string',
    bonusType: 'string',
    activityDateFrom: 'string',
    activityDateTo: 'string',
  }, validatorAttributeLabels, false),
})(CampaignsFilterForm);

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(FilterForm);
