import React, { Component } from 'react';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class CheckBox extends Component {
  static propTypes = {
    input: PropTypes.object,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    className: PropTypes.string,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  };
  static defaultProps = {
    id: null,
    input: null,
    disabled: false,
    className: null,
  };

  id = this.props.id || v4();

  render() {
    const {
      input,
      label,
      disabled,
      className,
      meta: { touched, error },
    } = this.props;

    return(
      <div className={classNames('custom-control custom-checkbox text-left', className)}>
        <input
          {...input}
          disabled={disabled}
          type="checkbox"
          className="custom-control-input"
          id={this.id}
        />
        <label className="custom-control-label" htmlFor={this.id}>
          {label}
        </label>
        <If condition={touched && error}>
          <div className="form-control-feedback">
            <i className="icon icon-alert" />
            {error}
          </div>
        </If>
      </div>
    );
  }
}

export default CheckBox;
