import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from '../FieldLabel';
import MultiInput from '../../MultiInput';

class MultiInputField extends Component {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    labelAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }).isRequired,
    labelClassName: PropTypes.string,
    helpText: PropTypes.node,
  };

  static defaultProps = {
    className: null,
    label: null,
    labelAddon: null,
    position: 'vertical',
    showErrorMessage: true,
    disabled: false,
    labelClassName: null,
    helpText: null,
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      disabled,
      placeholder,
      maxLength,
      label,
      id,
      onIconClick,
      async,
      input: { onChange, value },
      loadOptions,
    } = props;

    let inputField = (
      <MultiInput
        async={async}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder !== null ? placeholder : label}
        onChange={onChange}
        initialValues={value ? value.map(v => ({ label: v, value: v })) : []}
        loadOptions={loadOptions}
      />
    );

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          <If condition={inputAddonPosition === 'left'}>
            <div className="input-group-prepend">
              <span
                className={classNames(
                  'input-group-text input-group-addon',
                  { clickable: onIconClick },
                )}
                onClick={onIconClick}
              >
                {inputAddon}
              </span>
            </div>
          </If>
          {inputField}
          <If condition={inputAddonPosition === 'right'}>
            <div className="input-group-append">
              <span
                className={classNames(
                  'input-group-text input-group-addon',
                  { clickable: onIconClick },
                )}
                onClick={onIconClick}
                id={(
                  <If condition={id}>
                    {`${id}-right-icon`}
                  </If>
                )}
              >
                {inputAddon}
              </span>
            </div>
          </If>
        </div>
      );
    }

    return inputField;
  };

  renderHorizontal = (props) => {
    const {
      label,
      className,
      meta: { touched, error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group row',
      className,
      { 'has-danger': touched && error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <label className="col-md-3">{label}</label>
        <div className="col-md-9">
          {this.renderInput(props)}
        </div>
        <If condition={helpText || (showErrorMessage && touched && error)}>
          <div className="col-12">
            <div className="form-row">
              <If condition={showErrorMessage && touched && error}>
                <div className="col form-control-feedback">
                  <i className="icon icon-alert" />
                  {error}
                </div>
              </If>
              <If condition={helpText}>
                <div className="col form-group-help">
                  {helpText}
                </div>
              </If>
            </div>
          </div>
        </If>
      </div>
    );
  };

  renderVertical = (props) => {
    const {
      label,
      labelClassName,
      labelAddon,
      className,
      meta: { touched, error },
      showErrorMessage,
      helpText,
      disabled,
    } = props;

    const groupClassName = classNames(
      'form-group',
      className,
      { 'has-danger': touched && error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <FieldLabel
          label={label}
          addon={labelAddon}
          className={labelClassName}
        />
        {this.renderInput(props)}
        <If condition={helpText || (showErrorMessage && touched && error)}>
          <div className="form-row">
            <If condition={showErrorMessage && touched && error}>
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {error}
              </div>
            </If>
            <If condition={helpText}>
              <div className="col form-group-help">
                {helpText}
              </div>
            </If>
          </div>
        </If>
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default MultiInputField;
