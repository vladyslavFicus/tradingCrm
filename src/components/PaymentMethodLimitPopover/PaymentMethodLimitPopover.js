import React, { Component } from 'react';
import { Popover, PopoverContent } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { InputField } from '../../components/ReduxForm';
import PaymentMethodLimitPopoverStyle from './PaymentMethodLimitPopover.scss';

const attributeLabels = {
  min: 'Min',
  max: 'Max',
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
    placement: 'bottom',
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
        className="color-danger"
        onClick={() => onDisable(methodUUID, limitUUID)}
      >
        Disable {limitType}
      </span>;

    return (
      <div className="font-weight-700 cursor-pointer">
        {option}
      </div>
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
            <div className="row">
              <div className="col-md-12">
                { this.renderLimitDisableOptions() }
              </div>
            </div>

            <div className="row popover-body">
              <div className="col-md-4">
                <Field
                  name="min"
                  label={attributeLabels.min}
                  type="text"
                  position="vertical"
                  showErrorMessage={false}
                  inputClassName="form-control input-sm"
                  component={InputField}
                />
              </div>
              <div className="col-md-4">
                <Field
                  name="max"
                  label={attributeLabels.max}
                  type="text"
                  position="vertical"
                  showErrorMessage={false}
                  inputClassName="form-control input-sm"
                  component={InputField}
                />
              </div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm text-uppercase"
                  disabled={pristine || submitting || invalid}
                >
                  Save
                </button>
              </div>
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
