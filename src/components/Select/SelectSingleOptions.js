import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
});

class SelectSingleOptions extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOption: OptionPropType,
    bindActiveOption: PropTypes.func,
    optionComponent: PropTypes.oneOfType([PropTypes.func]),
  };
  static defaultProps = {
    className: 'select-block__options',
    optionClassName: 'select-block__options-item',
    options: [],
    selectedOption: undefined,
    optionComponent: null,
  };

  render() {
    const {
      options,
      selectedOption,
      className,
      optionClassName,
      onChange,
      bindActiveOption,
      optionComponent,
    } = this.props;
    const OptionCustomComponent = optionComponent;

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
            ...option.props,
          };

          if (isActive && bindActiveOption) {
            optionProps.ref = bindActiveOption;
          } else {
            optionProps.onClick = () => onChange(option);
          }

          return OptionCustomComponent
            ? <OptionCustomComponent {...optionProps} />
            : <div {...optionProps}>{option.label}</div>;
        })}
      </div>
    );
  }
}

export default SelectSingleOptions;
