import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import classNames from 'classnames';
import moment from 'moment';
import DateTime from 'react-datetime';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../utils/validator';
import PropTypes from '../../../../../../constants/propTypes';
import { typesLabels, operatingSystemsLabels } from '../../../../../../constants/devices';
import { SelectField, DateTimeField } from '../../../../../../components/ReduxForm';
import { attributeLabels } from './constants';
import renderLabel from '../../../../../../utils/renderLabel';

const FORM_NAME = 'userDevicesFilter';
const validate = createValidator({
  type: 'string',
  operatingSystem: 'string',
  dateFrom: 'string',
  dateTo: 'string',
}, Object.keys(attributeLabels).reduce((res, name) => ({ ...res, [name]: I18n.t(attributeLabels[name]) }), {}), false);

class FilterForm extends Component {
  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func,
    currentValues: PropTypes.object,
  };

  static defaultProps = {
    currentValues: {},
  };

  handleDateTimeChange = callback => (value) => {
    callback(value ? value.format('YYYY-MM-DDTHH:mm:00') : '');
  };

  handleReset = () => {
    this.props.reset();
    this.props.onSubmit();
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

  renderDateField = ({ input, placeholder, disabled, meta: { touched, error }, isValidDate }) => (
    <div className={classNames('form-group', { 'has-danger': touched && error })}>
      <DateTime
        dateFormat="MM/DD/YYYY"
        timeFormat="HH:mm"
        onChange={this.handleDateTimeChange(input.onChange)}
        value={input.value ? moment(input.value) : null}
        closeOnSelect
        inputProps={{
          disabled,
          placeholder,
        }}
        isValidDate={isValidDate}
      />
    </div>
  );

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
    } = this.props;

    return (
      <div className="well">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-10">
              <div className="col-md-3">
                <Field
                  name="deviceType"
                  label={I18n.t(attributeLabels.type)}
                  labelClassName="form-label"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('COMMON.ANY')}</option>
                  {Object.keys(typesLabels).map(type => (
                    <option key={type} value={type}>
                      { renderLabel(type, typesLabels) }
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-3">
                <Field
                  name="operatingSystem"
                  label={I18n.t(attributeLabels.operatingSystem)}
                  labelClassName="form-label"
                  component={SelectField}
                  position="vertical"
                >
                  <option value="">{I18n.t('COMMON.ANY')}</option>
                  {Object.keys(operatingSystemsLabels).map(system => (
                    <option key={system} value={system}>
                      {operatingSystemsLabels[system]}
                    </option>
                  ))}
                </Field>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">
                    {I18n.t('PLAYER_PROFILE.DEVICES.FILTER.LOGIN_DATE_RANGE')}
                  </label>
                  <div className="row">
                    <div className="col-md-5">
                      <Field
                        name="signInDateFrom"
                        component={DateTimeField}
                        placeholder={I18n.t(attributeLabels.dateFrom)}
                        position="vertical"
                        isValidDate={this.startDateValidator('signInDateTo')}
                      />
                    </div>
                    <div className="col-md-5">
                      <Field
                        name="signInDateTo"
                        position="vertical"
                        placeholder={I18n.t(attributeLabels.dateTo)}
                        component={DateTimeField}
                        isValidDate={this.endDateValidator('signInDateFrom')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group margin-top-25">
                <button
                  disabled={submitting}
                  className="btn btn-default btn-sm margin-inline font-weight-700"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm margin-inline font-weight-700"
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
  })(FilterForm)
);
