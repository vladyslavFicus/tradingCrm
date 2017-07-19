import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowEqual from '../../utils/shallowEqual';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

class SelectMultipleOptions extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOptions: PropTypes.arrayOf(OptionPropType),
  };
  static defaultProps = {
    className: 'select-block__options',
    optionClassName: 'control control--checkbox select-block_menu-checkbox',
    options: [],
    selectedOptions: [],
  };

  constructor() {
    super();

    this.activeOptionRef = null;
  }

  componentWillReceiveProps(nextProps) {
    if (shallowEqual(this.props.selectedOptions, nextProps.selectedOptions)) {
      if (nextProps.selectedOptions) {
        this.activeOptionRef = null;
      }
    }
  }

  bindActiveOptionRef = (node) => {
    this.activeOptionRef = node;
  };

  handleAddOption = (option) => {
    this.props.onChange([...this.props.selectedOptions, option]);
  };

  handleDeleteOption = (option) => {
    const index = this.props.selectedOptions.indexOf(option);

    if (index > -1) {
      const newSelectedOptions = [...this.props.selectedOptions];
      newSelectedOptions.splice(index, 1);
      this.props.onChange(newSelectedOptions);
    }
  };

  handleChange = (e, option) => {
    const { value } = e.target;


    return value ? this.handleAddOption(option) : this.handleDeleteOption(option);
  };

  render() {
    const { options, selectedOptions, className, optionClassName } = this.props;

    return (
      <div className={className}>
        <div className="select-block_menu-heading">
          available options
        </div>
        {options.map((option) => {
          const isActive = selectedOptions.indexOf(option);
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
