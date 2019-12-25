import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import I18n from 'i18n-js';
import Select from '../Select';

class FormikSelectField extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    name: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    searchable: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
    singleOptionComponent: PropTypes.func,
    touched: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.object,
    ]).isRequired,
    withAnyOption: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    disabled: false,
    error: '',
    label: null,
    multiple: false,
    placeholder: null,
    searchable: true,
    showErrorMessage: true,
    singleOptionComponent: null,
    touched: false,
    withAnyOption: false,
  };

  onHandleChange = (e) => {
    this.props.onChange(e);
  }

  render() {
    const {
      children,
      className,
      disabled,
      name,
      value,
      error,
      touched,
      label,
      multiple,
      placeholder,
      searchable,
      showErrorMessage,
      singleOptionComponent,
      withAnyOption,
    } = this.props;

    return (
      <div className={classNames(
        className,
        'form-group',
        { 'has-danger': showErrorMessage && touched && error },
        { 'is-disabled': disabled },
      )}
      >
        <If condition={label}>
          <label>{label}</label>
        </If>

        <div>
          <Select
            disabled={disabled}
            multiple={multiple}
            name={name}
            onChange={this.onHandleChange}
            placeholder={placeholder}
            showSearch={searchable}
            singleOptionComponent={singleOptionComponent}
            value={value}
          >
            {
              [
                withAnyOption && <option key="any" value={null}>{I18n.t('COMMON.ANY')}</option>,
                ...children,
              ]
            }
          </Select>

          <If condition={showErrorMessage && touched && error}>
            <div className="form-row">
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {error}
              </div>
            </div>
          </If>
        </div>
      </div>
    );
  }
}

export default FormikSelectField;
