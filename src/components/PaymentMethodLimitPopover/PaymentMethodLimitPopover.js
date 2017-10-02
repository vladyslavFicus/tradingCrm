import React, { Component } from 'react';
import { Popover, PopoverContent } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { InputField } from '../../components/ReduxForm';
import PaymentMethodLimitPopoverStyle from './PaymentMethodLimitPopover.scss';

const attributeLabels = {
  min: 'Min.',
  max: 'Max.',
};

const validator = createValidator({
  min: ['numeric', 'lessThan:max'],
  max: ['numeric', 'greaterThan:min'],
}, attributeLabels, false);

class PaymentMethodLimitPopover extends Component {
  static propTypes = {
    onDisable: PropTypes.func.isRequired,
    onEnable: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    limitUUID: PropTypes.string.isRequired,
    methodUUID: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    placement: PropTypes.string,
    target: PropTypes.string.isRequired,
    limitType: PropTypes.string.isRequired,
    submitting: PropTypes.bool,
    invalid: PropTypes.bool,
    pristine: PropTypes.bool,
    toggle: PropTypes.func,
    handleSubmit: PropTypes.func,
  };

  static defaultProps = {
    placement: 'bottom left',
    submitting: false,
    invalid: false,
    pristine: false,
    toggle: null,
    handleSubmit: null,
  };

  handleSubmit = (data) => {
    const { onSubmit, methodUUID, limitUUID } = this.props;
    return onSubmit(methodUUID, limitUUID, data);
  };

  renderLimitDisableOptions = () => {
    const {
      disabled: limitDisabled,
      onEnable,
      onDisable,
      methodUUID,
      limitUUID,
      limitType,
    } = this.props;

    const option = limitDisabled ?
      <span
        className="color-success"
        onClick={() => onEnable(methodUUID, limitUUID)}
      >
        Enable {limitType}
      </span> :
      <span
        className="payment-limit-popover__title_disable-action"
        onClick={() => onDisable(methodUUID, limitUUID)}
      >
        Disable {limitType}
      </span>;

    return (
      <h4>{option}</h4>
    );
  };

  render() {
    const {
      placement,
      target,
      toggle,
      handleSubmit,
      submitting,
      invalid,
      pristine,
    } = this.props;

    return (
      <Popover
        cssModule={PaymentMethodLimitPopoverStyle}
        placement={placement}
        isOpen
        toggle={toggle}
        target={target}
        className="payment-limit-popover"
      >
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <PopoverContent>
            <div className="payment-limit-popover__title">
              {this.renderLimitDisableOptions()}
            </div>
            <div className="payment-limit-popover__body">
              <Field
                name="min"
                label={attributeLabels.min}
                type="text"
                position="vertical"
                showErrorMessage={false}
                inputClassName="form-control input-sm"
                component={InputField}
              />
              <span className="range-group__separator">-</span>
              <Field
                name="max"
                label={attributeLabels.max}
                type="text"
                position="vertical"
                showErrorMessage={false}
                inputClassName="form-control input-sm"
                component={InputField}
              />
              <button
                type="submit"
                className="btn btn-primary text-uppercase"
                disabled={pristine || submitting || invalid}
              >
                {I18n.t('COMMON.SAVE')}
              </button>
            </div>
          </PopoverContent>
        </form>
      </Popover>
    );
  }
}

export default reduxForm({
  form: 'paymentMethodLimitPopoverForm',
  validate: validator,
})(PaymentMethodLimitPopover);
