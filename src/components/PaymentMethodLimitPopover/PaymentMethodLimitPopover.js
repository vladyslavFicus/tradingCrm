import React, { Component } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { reduxForm, Field } from 'redux-form';
import I18n from 'i18n-js';
import classNames from 'classnames';
import PropTypes from '../../constants/propTypes';
import { createValidator } from '../../utils/validator';
import { InputField, RangeGroup } from '../ReduxForm';
import './PaymentMethodLimitPopover.scss';
import { Currency } from '../Amount';

const attributeLabels = {
  min: I18n.t('COMMON.MIN'),
  max: I18n.t('COMMON.MAX'),
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
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool,
    toggle: PropTypes.func,
    handleSubmit: PropTypes.func,
    currencyCode: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    placement: 'bottom-start',
    submitting: false,
    pristine: false,
    toggle: null,
    handleSubmit: null,
    currencyCode: null,
    className: null,
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

    return (
      <Choose>
        <When condition={limitDisabled}>
          <button
            type="button"
            className="payment-limit-popover__title-action color-success"
            onClick={() => onEnable(methodUUID, limitUUID)}
          >
            {I18n.t('PAYMENT_METHOD_LIMIT_POPOVER.ENABLE_LIMIT_TYPE', { type: limitType })}
          </button>
        </When>
        <Otherwise>
          <button
            type="button"
            className="payment-limit-popover__title-action color-danger"
            onClick={() => onDisable(methodUUID, limitUUID)}
          >
            {I18n.t('PAYMENT_METHOD_LIMIT_POPOVER.DISABLE_LIMIT_TYPE', { type: limitType })}
          </button>
        </Otherwise>
      </Choose>
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
      currencyCode,
      className,
    } = this.props;

    return (
      <Popover
        placement={placement}
        isOpen
        toggle={toggle}
        target={target}
        className={classNames('payment-limit-popover', className)}
        hideArrow
        container={target}
      >
        <PopoverBody tag="form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="payment-limit-popover__title">
            {this.renderLimitDisableOptions()}
          </div>
          <div className="container-fluid payment-limit-popover__body">
            <div className="row no-gutters align-items-end">
              <RangeGroup className="col mb-0 pr-2" dividerClassName="payment-limit-popover__separator">
                <Field
                  name="min"
                  label={attributeLabels.min}
                  type="text"
                  position="vertical"
                  showErrorMessage={false}
                  component={InputField}
                  inputAddon={<Currency code={currencyCode} />}
                />
                <Field
                  name="max"
                  label={attributeLabels.max}
                  type="text"
                  position="vertical"
                  showErrorMessage={false}
                  component={InputField}
                  inputAddon={<Currency code={currencyCode} />}
                />
              </RangeGroup>
              <div className="col-auto">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={pristine || submitting || invalid}
                >
                  {I18n.t('COMMON.SAVE')}
                </button>
              </div>
            </div>
          </div>
        </PopoverBody>
      </Popover>
    );
  }
}

export default reduxForm({
  form: 'paymentMethodLimitPopoverForm',
  validate: validator,
})(PaymentMethodLimitPopover);
