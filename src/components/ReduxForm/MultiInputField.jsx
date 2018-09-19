import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

const components = {
  DropdownIndicator: null,
};

const createOption = label => ({
  label,
  value: label,
});

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
    placeholder: PropTypes.string,
    inputAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }).isRequired,
    labelClassName: PropTypes.string,
    onIconClick: PropTypes.func,
    helpText: PropTypes.node,
  };
  static defaultProps = {
    className: null,
    label: null,
    labelAddon: null,
    position: 'vertical',
    showErrorMessage: true,
    disabled: false,
    placeholder: 'Type something and press enter...',
    inputAddon: null,
    inputAddonPosition: 'left',
    labelClassName: null,
    onIconClick: null,
    helpText: null,
  };

  state = {
    inputValue: '',
    value: [],
  };

  handleChange = (value) => {
    const { input: { onChange } } = this.props;

    this.setState({ value }, () => {
      onChange(!value.length ? '' : value);
    });
  };

  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };

  handleKeyDown = (event) => {
    const { inputValue, value } = this.state;

    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        this.setState({
          inputValue: '',
          value: [...value, createOption(inputValue)],
        }, () => {
          const values = this.state.value.map(p => p.value);

          this.props.input.onChange(values);
        });
        event.preventDefault();
    }
  };

  renderInput = (props) => {
    const { inputValue, value } = this.state;

    const {
      inputAddon,
      inputAddonPosition,
      disabled,
      placeholder,
      label,
      id,
      onIconClick,
    } = props;

    let inputField = (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder !== null ? placeholder : label}
        value={value}
        disabled={disabled}
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
                id={
                  <If condition={id}>
                    {`${id}-right-icon`}
                  </If>
                }
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
