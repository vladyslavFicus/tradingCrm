import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TextArea.scss';

class TextArea extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    labelClassName: PropTypes.string,
    showErrorMessage: PropTypes.bool,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    helpText: PropTypes.node,
    resize: PropTypes.string,
  };

  static defaultProps = {
    error: null,
    disabled: false,
    className: '',
    label: '',
    value: '',
    onChange: () => { },
    showErrorMessage: true,
    labelClassName: '',
    placeholder: '',
    maxLength: 10000,
    helpText: null,
    resize: 'none',
  };

  render() {
    const {
      name,
      value,
      disabled,
      onChange,
      placeholder,
      showErrorMessage,
      labelClassName,
      className,
      helpText,
      resize,
      label,
      maxLength,
      error,
      ...textarea
    } = this.props;

    return (
      <div className={
        classNames(
          'TextArea',
          className,
          {
            'TextArea--error': error,
          },
        )
      }
      >
        <If condition={label}>
          <label className={
            classNames(
              'TextArea__label',
              labelClassName,
            )
          }
          >
            {label}
          </label>
        </If>
        <textarea
          className={classNames(
            'TextArea__textarea',
            {
              'TextArea__textarea--disabled': disabled,
              'TextArea__textarea-resize--none': resize === 'none',
              'TextArea__textarea-resize--both': resize === 'both',
              'TextArea__textarea-resize--horizontal': resize === 'horizontal',
              'TextArea__textarea-resize--vertical': resize === 'vertical',
              'TextArea__textarea--error': error && showErrorMessage,
            },
          )}
          name={name}
          disabled={disabled}
          onChange={onChange}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value !== null ? value : ''}
          resize={resize}
          {...textarea}
        />
        <If condition={error && showErrorMessage}>
          <div className="TextArea__error-wrapper">
            <i className="TextArea__error-icon icon-alert" />
            {error}
          </div>
        </If>
        <If condition={helpText}>
          <div className="TextArea__help">
            {helpText}
          </div>
        </If>
      </div>
    );
  }
}

export default TextArea;
