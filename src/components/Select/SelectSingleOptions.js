import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

class SelectSingleOptions extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOption: OptionPropType,
  };
  static defaultProps = {
    className: 'select-block__options',
    optionClassName: 'select-block__options-item',
    options: [],
    selectedOption: undefined,
  };

  render() {
    const { options, selectedOption, className, optionClassName, onChange, bindActiveOption } = this.props;

    if (options.length === 0) {
      return null;
    }

    return (
      <div className={className}>
        {options.map((option) => {
          const isActive = selectedOption && selectedOption.value === option.value;
          const optionProps = {
            key: option.key,
            className: classNames(optionClassName, {
              'is-selected': isActive,
            }),
          };

          if (isActive) {
            optionProps.ref = bindActiveOption;
          } else {
            optionProps.onClick = () => onChange(option);
          }

          return (
            <div {...optionProps}>
              {option.label}
            </div>
          );
        })}
      </div>
    );
  }
}

export default SelectSingleOptions;
