import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
});

class SelectSingleOptions extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOption: OptionPropType,
    bindActiveOption: PropTypes.func,
    optionComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  };

  static defaultProps = {
    className: 'select-block__options',
    optionClassName: 'select-block__options-item',
    options: [],
    selectedOption: undefined,
    optionComponent: null,
    bindActiveOption: null,
  };

  render() {
    const {
      options,
      selectedOption,
      className,
      optionClassName,
      onChange,
      handleSelectHide,
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
              'is-disabled': option.props.disabled,
            }),
            ...option.props,
          };

          if (isActive && bindActiveOption) {
            optionProps.ref = bindActiveOption;
          } else {
            optionProps.onClick = () => onChange(option);
          }

          return (
            <Choose>
              <When condition={OptionCustomComponent}>
                <OptionCustomComponent hideSelect={() => handleSelectHide()} {...optionProps} />
              </When>
              <Otherwise>
                <div {...optionProps}>{option.label}</div>
              </Otherwise>
            </Choose>
          );
        })}
      </div>
    );
  }
}

export default SelectSingleOptions;
