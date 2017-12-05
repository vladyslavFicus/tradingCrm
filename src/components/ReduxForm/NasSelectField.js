import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../Select';

class NasSelectField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    placeholder: PropTypes.string,
    labelTag: PropTypes.string,
    labelClassName: PropTypes.string,
    labelAddon: PropTypes.element,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
    inputClassName: PropTypes.string,
    inputAddon: PropTypes.element,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    inputButton: PropTypes.any,
    showInputButton: PropTypes.bool,
    optionsHeader: PropTypes.func,
    singleOptionComponent: PropTypes.func,
    onRemoveClick: PropTypes.func,
  };
  static defaultProps = {
    position: 'horizontal',
    placeholder: null,
    labelTag: 'label',
    labelClassName: 'form-label',
    labelAddon: null,
    showErrorMessage: true,
    disabled: false,
    multiple: false,
    inputAddon: null,
    inputAddonPosition: 'left',
    inputButton: null,
    inputClassName: 'form-control select-block',
    showInputButton: false,
    optionsHeader: null,
    singleOptionComponent: null,
    onRemoveClick: null,
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      inputButton,
      showInputButton,
      input,
      disabled,
      inputClassName,
      meta: { touched, error },
      children,
      multiple,
      placeholder,
      optionsHeader,
      singleOptionComponent,
    } = props;

    let inputField = (
      <Select
        {...input}
        placeholder={placeholder}
        optionsHeader={optionsHeader}
        singleOptionComponent={singleOptionComponent}
        disabled={disabled}
        multiple={multiple}
        className={classNames(inputClassName, { 'has-danger': touched && error })}
      >
        {children}
      </Select>
    );

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          {inputAddonPosition === 'right' && inputField}
          <div className="input-group-addon">
            {inputAddon}
          </div>
          {inputAddonPosition === 'left' && inputField}
        </div>
      );
    }

    if (inputButton) {
      inputField = (
        <div className="form-control-with-button">
          {inputField}
          <div className="form-control-button">
            {showInputButton && inputButton}
          </div>
        </div>
      );
    }

    return inputField;
  };

  renderVertical = (props) => {
    const {
      label,
      labelTag,
      labelClassName,
      labelAddon,
      meta: { touched, error },
      showErrorMessage,
      onRemoveClick,
    } = props;

    return (
      <div className={classNames('form-group', { 'has-danger': touched && error })}>
        {
          React.createElement(labelTag,
            { className: labelClassName },
            <div>
              {label}{labelAddon}
              {onRemoveClick && <button className="nas nas-clear_icon label-clear" onClick={onRemoveClick} />}
            </div>)
        }
        {this.renderInput(props)}
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            <i className="nas nas-field_alert_icon" />
            {error}
          </div>
        }
      </div>
    );
  };

  renderHorizontal = (props) => {
    const {
      label,
      labelTag,
      labelClassName,
      labelAddon,
      meta: { touched, error },
      showErrorMessage,
      onRemoveClick,
    } = props;

    return (
      <div className={classNames('form-group row', { 'has-danger': touched && error })}>
        <div className="col-md-3">
          {
            React.createElement(labelTag,
              { className: labelClassName },
              <div>
                {label}{labelAddon}
                {onRemoveClick && <button className="nas nas-clear_icon label-clear" onClick={onRemoveClick} />}
              </div>)
          }
        </div>
        <div className="col-md-9">
          {this.renderInput(props)}
          {
            showErrorMessage && touched && error &&
            <div className="form-control-feedback">
              <i className="nas nas-field_alert_icon" />
              {error}
            </div>
          }
        </div>
      </div>
    );
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }
}

export default NasSelectField;
