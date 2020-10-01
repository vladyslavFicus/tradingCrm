import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import Select from '../Select';
import FieldLabel from './FieldLabel';

class NasSelectField extends Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func,
    }).isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    placeholder: PropTypes.string,
    labelClassName: PropTypes.string,
    labelAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
    multiple: PropTypes.bool,
    multipleLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }).isRequired,
    inputAddon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    searchable: PropTypes.bool,
    inputAddonPosition: PropTypes.oneOf(['left', 'right']),
    optionsHeader: PropTypes.func,
    singleOptionComponent: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    helpText: PropTypes.node,
    withAnyOption: PropTypes.bool,
  };

  static defaultProps = {
    position: 'vertical',
    placeholder: null,
    className: '',
    labelClassName: null,
    labelAddon: null,
    showErrorMessage: true,
    disabled: false,
    multiple: false,
    multipleLabel: false,
    inputAddon: null,
    searchable: true,
    inputAddonPosition: 'left',
    optionsHeader: null,
    singleOptionComponent: null,
    id: null,
    helpText: null,
    withAnyOption: false,
  };

  renderInput = (props) => {
    const {
      inputAddon,
      inputAddonPosition,
      input,
      disabled,
      children,
      multiple,
      multipleLabel,
      placeholder,
      optionsHeader,
      searchable,
      singleOptionComponent,
      onFieldChange,
      id,
      withAnyOption,
    } = props;

    let inputField = (
      <Select
        {...input}
        onChange={onFieldChange || input.onChange}
        placeholder={placeholder}
        showSearch={searchable}
        optionsHeader={optionsHeader}
        singleOptionComponent={singleOptionComponent}
        disabled={disabled}
        multiple={multiple}
        multipleLabel={multipleLabel}
        id={id}
      >
        {[withAnyOption && <option key="any" value={null}>{I18n.t('COMMON.ANY')}</option>, ...children]}
      </Select>
    );

    if (inputAddon) {
      inputField = (
        <div className="input-group">
          <If condition={inputAddonPosition === 'left'}>
            <div className="input-group-prepend">
              <span className="input-group-text input-group-addon">
                {inputAddon}
              </span>
            </div>
          </If>
          {inputField}
          <If condition={inputAddonPosition === 'right'}>
            <div className="input-group-append">
              <span className="input-group-text input-group-addon">
                {inputAddon}
              </span>
            </div>
          </If>
        </div>
      );
    }

    return inputField;
  };

  renderVertical = (props) => {
    const {
      label,
      labelClassName,
      className,
      labelAddon,
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

  renderHorizontal = (props) => {
    const {
      label,
      meta: { touched, error },
      showErrorMessage,
      className,
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
