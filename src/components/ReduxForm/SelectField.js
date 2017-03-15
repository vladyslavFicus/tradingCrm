import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class SelectField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    position: PropTypes.oneOf(['horizontal', 'vertical']),
    showErrorMessage: PropTypes.bool,
  };

  static defaultProps = {
    position: 'horizontal',
    showErrorMessage: true,
  };

  render() {
    return this.props.position === 'vertical'
      ? this.renderVertical(this.props)
      : this.renderHorizontal(this.props);
  }

  renderVertical = (props) => {
    const { input, label, children, multiple, disabled, meta: { touched, error }, showErrorMessage } = props;

    return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
      <label className="form-control-label">{label}</label>
      <select
        {...input}
        multiple={multiple}
        disabled={disabled}
        className={classNames('form-control', { 'has-danger': touched && error })}
      >
        {children}
      </select>
      {
        showErrorMessage && touched && error &&
        <div className="form-control-feedback">
          {error}
        </div>
      }
    </div>;
  };

  renderHorizontal = (props) => {
    const { input, label, children, multiple, disabled, meta: { touched, error }, showErrorMessage } = props;

    return <div className={classNames('form-group row', { 'has-danger': touched && error })}>
      <div className="col-md-3">
        <label className="form-control-label">
          {label}
        </label>
      </div>
      <div className="col-md-9">
        <select
          {...input}
          multiple={multiple}
          disabled={disabled}
          className={classNames('form-control', { 'has-danger': touched && error })}
        >
          {children}
        </select>
        {
          showErrorMessage && touched && error &&
          <div className="form-control-feedback">
            {error}
          </div>
        }
      </div>
    </div>;
  };
}

export default SelectField;
