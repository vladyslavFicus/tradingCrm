import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, getFormValues } from 'redux-form';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { createValidator } from '../../../../../../utils/validator';
import PropTypes from '../../../../../../constants/propTypes';
import { typesLabels } from '../../../../../../constants/devices';
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
    submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    currentValues: PropTypes.object,
    deviceType: PropTypes.array.isRequired,
    operatingSystem: PropTypes.array.isRequired,
  };

  static defaultProps = {
    currentValues: {},
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

  render() {
    const {
      submitting,
      handleSubmit,
      onSubmit,
      operatingSystem,
      deviceType,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="well">
          <div className="filter-row">
            <div className="filter-row__medium">
              <Field
                name="deviceType"
                label={I18n.t(attributeLabels.type)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {deviceType.map(item => (
                  <option key={item} value={item}>
                    {renderLabel(item, typesLabels)}
                  </option>
                ))}
              </Field>
            </div>
            <div className="filter-row__medium">
              <Field
                name="operatingSystem"
                label={I18n.t(attributeLabels.operatingSystem)}
                component={SelectField}
                position="vertical"
              >
                <option value="">{I18n.t('COMMON.ANY')}</option>
                {operatingSystem.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </Field>
            </div>
            <div className="filter-row__big">
              <div className="form-group">
                <label>{I18n.t('PLAYER_PROFILE.DEVICES.FILTER.LOGIN_DATE_RANGE')}</label>
                <div className="range-group">
                  <Field
                    name="signInDateFrom"
                    placeholder={I18n.t(attributeLabels.dateFrom)}
                    component={DateTimeField}
                    isValidDate={this.startDateValidator('signInDateTo')}
                    position="vertical"
                    className={null}
                  />
                  <span className="range-group__separator">-</span>
                  <Field
                    name="signInDateTo"
                    placeholder={I18n.t(attributeLabels.dateTo)}
                    component={DateTimeField}
                    isValidDate={this.endDateValidator('signInDateFrom')}
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
                  className="btn btn-default btn-sm"
                  onClick={this.handleReset}
                  type="reset"
                >
                  {I18n.t('COMMON.RESET')}
                </button>
                <button
                  disabled={submitting}
                  className="btn btn-primary btn-sm"
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

export default connect(state => ({
  currentValues: getFormValues(FORM_NAME)(state),
}))(
  reduxForm({
    form: FORM_NAME,
    validate,
  })(FilterForm),
);
