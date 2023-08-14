// @ts-nocheck
/* eslint-disable */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { v4 } from 'uuid';
import { Utils } from '@crm/common';
import './SelectMultipleOptions.scss';

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
    const newSelectedOptions = Utils.deleteFromArray(this.props.selectedOptions, option);

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

    if (!options?.length) {
      return null;
    }

    return (
      <div className={classNames('SelectMultipleOptions', className)}>
        <div className="SelectMultipleOptions__header">
          {headerText}
        </div>
        {
          headerButtonClassName && headerButtonOnClick && headerButtonIconClassName && headerButtonText
          && (
            <button type="button" className={headerButtonClassName} onClick={headerButtonOnClick}>
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
              'SelectMultipleOptions__item',
              {
                'SelectMultipleOptions__item--unchecked': !isActive,
                'SelectMultipleOptions__item--checked': isActive,
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
                hidden
                type="checkbox"
                id={`${uniq}-${option.value}`}
                checked={isActive}
                onChange={e => this.handleChange(e, option)}
                disabled={option.props.disabled}
              />
              <label className="SelectMultipleOptions__item__label" htmlFor={`${uniq}-${option.value}`}>
                <i
                  className={classNames('SelectMultipleOptions__item__icon', {
                    'fa fa-square-o': !isActive,
                    'fa fa-check-square': isActive,
                    'is-disabled': option.props.disabled,
                  })}
                />
                <span>{option.label}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectMultipleOptions;
