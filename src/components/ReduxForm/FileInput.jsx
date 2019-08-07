import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import FieldLabel from './FieldLabel';

class FileInput extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.any,
      onChange: PropTypes.func.isRequired,
    }).isRequired,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    disabled: PropTypes.bool,
    meta: PropTypes.shape({
      touched: PropTypes.bool,
      error: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }).isRequired,
    id: PropTypes.string,
    showErrorMessage: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    label: null,
    disabled: false,
    showErrorMessage: true,
    id: null,
  };

  handleChange = (e) => {
    e.preventDefault();

    e.stopPropagation();
    this.props.input.onChange(e.target.files);
  };

  render() {
    const {
      label,
      className,
      meta: { touched, error },
      disabled,
      input: { value, ...input },
      id,
      showErrorMessage,
    } = this.props;

    const groupClassName = classNames(
      'form-group file-input',
      className,
      { 'has-danger': touched && error },
      { 'is-disabled': disabled },
    );

    return (
      <div className={groupClassName}>
        <FieldLabel
          label={label}
        />
        <input
          {...input}
          id={id}
          onChange={this.handleChange}
          disabled={disabled}
          type="file"
          className="form-control"
        />
        <If condition={showErrorMessage && touched && error}>
          <div className="form-row">
            <If condition={touched && error}>
              <div className="col form-control-feedback">
                <i className="icon icon-alert" />
                {error}
              </div>
            </If>
          </div>
        </If>
      </div>
    );
  }
}

export default FileInput;
