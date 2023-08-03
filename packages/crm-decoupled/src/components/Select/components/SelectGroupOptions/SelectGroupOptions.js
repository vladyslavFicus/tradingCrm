import React, { PureComponent, forwardRef } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './SelectGroupOptions.scss';

const OptionPropType = PropTypes.shape({
  key: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object, PropTypes.bool]),
});

class SelectGroupOptions extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    optionClassName: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    handleSelectHide: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(OptionPropType),
    selectedOption: OptionPropType,
    bindActiveOption: PropTypes.func,
    optionComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    withGroup: PropTypes.shape({
      firstTitle: PropTypes.string,
      secondTitle: PropTypes.string,
    }).isRequired,
  };

  static defaultProps = {
    className: 'SelectSingleOptions',
    optionClassName: 'SelectSingleOptions__item',
    options: [],
    selectedOption: undefined,
    optionComponent: null,
    bindActiveOption: null,
  };

  withRef = (Component) => {
    if (Component.prototype && Component.prototype.isReactComponent) {
      return Component;
    }

    return forwardRef(
      (funcProps, ref) => <Component forwardedRef={ref} {...funcProps} />,
    );
  };

  renderOptions = (options) => {
    const {
      selectedOption,
      optionClassName,
      onChange,
      handleSelectHide,
      bindActiveOption,
      optionComponent,
    } = this.props;

    const OptionCustomComponent = optionComponent && this.withRef(optionComponent);

    return (options.map((option) => {
      const isActive = selectedOption && selectedOption.value === option.value;
      const optionProps = {
        key: option.key,
        ...option.props,
        className: classNames(optionClassName, option.props?.className, {
          'is-selected': isActive,
          'is-disabled': option.props.disabled,
        }),
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
    }));
  };

  getFilterOptionsWithFavourite = (options, isFavourite = true) => options.filter(({ props }) => (
    isFavourite ? !!props['data-isFavourite'] : !props['data-isFavourite']
  ));

  render() {
    const {
      options,
      className,
      withGroup,
    } = this.props;

    if (!options?.length) {
      return null;
    }

    return (
      <div className={className}>
        <p className="SelectSingleOptions__favourite">{I18n.t(withGroup.firstTitle)}</p>
        {this.renderOptions(this.getFilterOptionsWithFavourite(options))}

        <hr className="SelectSingleOptions__hr" />

        <p className="SelectSingleOptions__favourite">{I18n.t(withGroup.secondTitle)}</p>
        {this.renderOptions(this.getFilterOptionsWithFavourite(options, false))}
      </div>
    );
  }
}

export default SelectGroupOptions;
