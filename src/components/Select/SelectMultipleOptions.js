import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import deleteFromArray from '../../utils/deleteFromArray';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
});

class SelectMultipleOptions extends React.PureComponent {
  static propTypes = {
    headerText: PropTypes.string.isRequired,
    className: PropTypes.string,
    optionClassName: PropTypes.string,
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
    optionClassName: 'control control--checkbox select-block_menu-checkbox',
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
    return e.target.checked
      ? this.handleAddOption(option)
      : this.handleDeleteOption(option);
  };

  render() {
    const {
      options,
      selectedOptions,
      className,
      optionClassName,
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
          headerButtonClassName && headerButtonOnClick && headerButtonIconClassName && headerButtonText &&
          <button type="button" className={headerButtonClassName} onClick={headerButtonOnClick}>
            <i className={headerButtonIconClassName} /> {headerButtonText}
          </button>
        }
        {options.map((option) => {
          const isActive = selectedOptions.indexOf(option) > -1;
          const optionProps = {
            key: option.key,
            className: classNames(optionClassName, {
              'is-selected': isActive,
            }),
          };

          if (isActive) {
            optionProps.ref = this.bindActiveOptionRef;
          }

          return (
            <label {...optionProps}>
              {option.label}
              <input type="checkbox" checked={isActive} onChange={e => this.handleChange(e, option)} />
              <div className={classNames('control__indicator', { 'is-checked': isActive })}>
                <i className="nas nas-check_box" />
              </div>
            </label>
          );
        })}
      </div>
    );
  }
}

export default SelectMultipleOptions;
