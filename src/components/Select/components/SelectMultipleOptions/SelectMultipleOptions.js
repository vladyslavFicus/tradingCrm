import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 } from 'uuid';
import deleteFromArray from 'utils/deleteFromArray';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired,
});

class SelectMultipleOptions extends PureComponent {
  static propTypes = {
    headerText: PropTypes.string.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOptions: PropTypes.arrayOf(OptionPropType),
    headerButtonClassName: PropTypes.string,
    headerButtonIconClassName: PropTypes.string,
    headerButtonText: PropTypes.string,
    headerButtonOnClick: PropTypes.func,
  };

  static defaultProps = {
    headerButtonClassName: null,
    headerButtonIconClassName: null,
    headerButtonText: null,
    headerButtonOnClick: null,
    className: 'select-block__options',
    options: [],
    selectedOptions: [],
  };

  handleAddOption = (option) => {
    this.props.onChange([...this.props.selectedOptions, option]);
  };

  handleDeleteOption = (option) => {
    const newSelectedOptions = deleteFromArray(this.props.selectedOptions, option);

    if (newSelectedOptions.length !== this.props.selectedOptions.length) {
      this.props.onChange(newSelectedOptions);
    }
  };

  handleChange = (e, option) => {
    e.stopPropagation();

    if (e.target.checked) {
      this.handleAddOption(option);
    } else {
      this.handleDeleteOption(option);
    }
  };

  render() {
    const {
      options,
      selectedOptions,
      className,
      headerText,
      headerButtonClassName,
      headerButtonIconClassName,
      headerButtonText,
      headerButtonOnClick,
    } = this.props;

    if (options.length === 0) {
      return null;
    }

    return (
      <div className={className}>
        <div className="select-block__heading">
          {headerText}
        </div>
        {
          headerButtonClassName && headerButtonOnClick && headerButtonIconClassName && headerButtonText
          && (
            <button
              type="button"
              className={headerButtonClassName}
              onClick={headerButtonOnClick}
              tabIndex={-1}
            >
              <i className={headerButtonIconClassName} /> {headerButtonText}
            </button>
          )
        }
        {options.map((option) => {
          const uniq = v4();
          const isActive = selectedOptions.indexOf(option) > -1;
          const optionProps = {
            key: option.key,
            className: classNames(
              option.props.className,
              'custom-control custom-checkbox select-block-option',
              {
                'is-selected': isActive,
                'is-disabled': option.props.disabled,
              },
            ),
          };

          if (isActive) {
            optionProps.ref = this.bindActiveOptionRef;
          }

          return (
            <div {...optionProps}>
              <input
                type="checkbox"
                className="custom-control-input"
                id={`${uniq}-${option.value}`}
                checked={isActive}
                onChange={e => this.handleChange(e, option)}
                disabled={option.props.disabled}
                tabIndex={-1}
              />
              <label className="custom-control-label" htmlFor={`${uniq}-${option.value}`}>
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectMultipleOptions;
