import React, { PureComponent } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'compose-function';
import onClickOutside from 'react-onclickoutside';
import { difference, isObject } from 'lodash';
import { Popover } from 'reactstrap';
import shallowEqual from 'utils/shallowEqual';
import deleteFromArray from 'utils/deleteFromArray';
import SelectSearchBox, {
  filterOptionsByQuery,
  filterOptionsByQueryWithMultiple,
} from '../SelectSearchBox/SelectSearchBox';
import SelectSingleOptions from '../SelectSingleOptions/SelectSingleOptions';
import SelectGroupOptions from '../SelectGroupOptions/SelectGroupOptions';
import SelectMultipleOptions from '../SelectMultipleOptions/SelectMultipleOptions';
import './Select.scss';

const filterOptions = options => options && (Array.isArray(options)
  ? options
    .filter(option => option?.type === 'option')
    .map(({ key, props: { value, children, ...props } }) => ({
      label: children,
      value,
      key,
      props,
    }))
    .sort((currentOption, nextOption) => +currentOption.props.disabled - +nextOption.props.disabled)
  : []
);

const filterSelectedOptions = (options, selectedOptions, multiple) => (
  multiple
    ? options.filter(option => !selectedOptions.includes(option))
    : options
);

const objectShallowEqual = (current, next) => {
  if (!isObject(current) && !isObject(next)) {
    return current === next;
  }

  return shallowEqual(current, next);
};

class Select extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.node]).isRequired,
    onChange: PropTypes.func,
    onRealtimeChange: PropTypes.func,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    multiple: PropTypes.bool,
    multipleLabel: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object, PropTypes.bool]),
    showSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    searchPlaceholder: PropTypes.string,
    name: PropTypes.string,
    optionsHeader: PropTypes.func,
    singleOptionComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    disabled: PropTypes.bool,
    customClassName: PropTypes.string,
    customSelectBlockClassName: PropTypes.string,
    customSelectBlockContainerClassName: PropTypes.string,
    id: PropTypes.string,
    isFocused: PropTypes.bool,
    withArrowDown: PropTypes.bool,
    customArrowComponent: PropTypes.object,
    hasTargetPortal: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    withGroup: PropTypes.shape({
      firstTitle: PropTypes.string,
      secondTitle: PropTypes.string,
    }),
  };

  static defaultProps = {
    name: undefined,
    onChange: () => {},
    onRealtimeChange: () => {},
    showSearch: null,
    placeholder: 'Any',
    multiple: false,
    multipleLabel: false,
    value: null,
    searchPlaceholder: null,
    optionsHeader: null,
    singleOptionComponent: null,
    disabled: false,
    customClassName: null,
    customSelectBlockClassName: null,
    customSelectBlockContainerClassName: null,
    id: null,
    withArrowDown: true,
    customArrowComponent: null,
    isFocused: false,
    hasTargetPortal: null,
    withGroup: null,
  };

  mounted = false;

  constructor(props) {
    super(props);

    this.selectRef = React.createRef();

    const originalOptions = filterOptions(props.children);
    const selectedOptions = props.multiple
      ? originalOptions.filter(option => props.value.includes(option.value))
      : [originalOptions.find(option => option.value === props.value)].filter(option => option);

    this.state = {
      opened: false,
      query: '',
      originalOptions,
      options: filterSelectedOptions(originalOptions, selectedOptions, props.multiple),
      originalSelectedOptions: selectedOptions,
      selectedOptions,
      toSelectOptions: [],
      // eslint-disable-next-line react/no-unused-state
      children: props.children,
      // eslint-disable-next-line react/no-unused-state
      value: props.value,
      // eslint-disable-next-line react/no-unused-state
      multiple: props.multiple,
    };

    this.activeOptionRef = null;
    this.optionsContainerRef = null;
    this.searchBarRef = null;
  }

  static getDerivedStateFromProps = (nextProps, prevState) => {
    const { query, originalOptions, opened, children, multiple } = prevState;
    const { value } = nextProps;
    let options = originalOptions;

    if (!shallowEqual(children, nextProps.children) && !opened) {
      options = [...filterOptions(nextProps.children)];

      const selectedOptions = multiple
        ? options.filter(option => value.includes(option.value))
        : [options.find(option => option.value === value)].filter(option => option);

      return {
        originalOptions: options,
        options: filterSelectedOptions(filterOptionsByQuery(query, [...options]), selectedOptions, multiple),
        selectedOptions,
        originalSelectedOptions: selectedOptions,
        toSelectOptions: [],
        children: nextProps.children,
        value,
        multiple: nextProps.multiple,
      };
    }

    if (!objectShallowEqual(prevState.value, value) && !opened) {
      const opts = [...filterOptions(nextProps.children)];
      // happened when after choosing value, we add more options to select
      if (opts.length > options) {
        options = opts;
      }

      const originalSelectedOptions = nextProps.multiple
        ? options.filter(option => nextProps.value.includes(option.value))
        : [options.find(option => option.value === nextProps.value)].filter(option => option);

      return {
        ...(opts.length > options && { originalOptions: opts }),
        options: filterSelectedOptions(options, originalSelectedOptions, nextProps.multiple),
        originalSelectedOptions,
        selectedOptions: filterOptionsByQuery(query, originalSelectedOptions),
        children,
        value,
        multiple,
      };
    }

    return prevState;
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  bindRef = name => (node) => {
    this[name] = node;
  };

  bindSearchBarRef = this.bindRef('searchBarRef'); // eslint-disable-line

  bindActiveOptionRef = this.bindRef('activeOptionRef');

  bindContainerRef = this.bindRef('optionsContainerRef');

  handleShowSearch = () => this.props.children.length > 5;

  handleInputClick = () => {
    if (!this.state.opened) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
  };

  handleClickOutside = (event) => {
    if (this.state.opened && !event?.target?.closest('.Select__popover')) {
      this.handleClose();
    }
  };

  handleSelectSingleOption = (option) => {
    if (option.props.disabled) return;

    this.updateState({ toSelectOptions: [option], dirty: true }, this.handleClose);
  };

  handleSelectMultipleOptions = (options) => {
    this.updateState({ toSelectOptions: options, dirty: true });

    this.props.onRealtimeChange(options.map(item => item.value));
  };

  handleResetSelectedOptions = () => {
    this.updateState({
      options: [...this.state.originalOptions],
      toSelectOptions: [],
      selectedOptions: [],
      originalSelectedOptions: [],
      dirty: true,
    });

    this.props.onRealtimeChange([]);
  };

  toggleSelectAllOptions = () => {
    const { toSelectOptions, options } = this.state;
    const notDisabledOptions = options.filter(option => !option.props.disabled);

    // If not all options selected --> select all
    if (toSelectOptions.length !== notDisabledOptions.length) {
      this.updateState({ toSelectOptions: notDisabledOptions, dirty: true });

      this.props.onRealtimeChange([...this.state.selectedOptions, ...notDisabledOptions].map(item => item.value));
    } else {
      this.updateState({ toSelectOptions: [], dirty: true });

      this.props.onRealtimeChange([]);
    }
  };

  handleDeleteSelectedOption = (options) => {
    const { query, originalSelectedOptions } = this.state;
    const deletedOptions = originalSelectedOptions.filter(option => !options.includes(option));
    const newOriginalSelectedOptions = deletedOptions
      .reduce((res, option) => deleteFromArray(res, option), originalSelectedOptions);

    if (originalSelectedOptions.length !== newOriginalSelectedOptions.length) {
      this.updateState({
        options: [...this.state.options, ...deletedOptions],
        originalSelectedOptions: newOriginalSelectedOptions,
        selectedOptions: filterOptionsByQuery(query, newOriginalSelectedOptions),
        dirty: true,
      });

      this.props.onRealtimeChange(newOriginalSelectedOptions.map(item => item.value));
    }
  };

  handleOpen = () => {
    if (!this.state.opened) {
      this.updateState({ opened: true }, () => {
        if (this.optionsContainerRef) {
          const { multiple } = this.props;

          if (multiple) {
            this.optionsContainerRef.scrollTop = 0;
          } else if (this.activeOptionRef) {
            let offset = this.activeOptionRef.offsetTop - (this.activeOptionRef.offsetHeight + 25);

            if (this.searchBarRef) {
              offset -= this.searchBarRef.offsetHeight;
            }

            this.optionsContainerRef.scrollTop = Math.max(offset, 0);
          }
        }

        if (this.searchBarRef) {
          setTimeout(() => this.searchBarRef.focus(), 100);
        }
      });
    }
  };

  handleClose = () => {
    const { toSelectOptions, originalOptions, originalSelectedOptions, dirty } = this.state;
    const { multiple } = this.props;
    let newValue = (multiple
      ? [...originalSelectedOptions, ...toSelectOptions]
      : [...toSelectOptions]).map(option => option.value);

    this.updateState({ opened: false }, () => {
      window.requestAnimationFrame(() => {
        this.updateState({
          query: '',
          options: originalOptions,
          toSelectOptions: [],
          selectedOptions: [...originalSelectedOptions],
          dirty: false,
        }, () => {
          if (dirty) {
            newValue = Array.isArray(newValue) && !newValue.length ? undefined : newValue;
            if (multiple) {
              this.props.onChange(newValue);
            } else if (newValue) {
              this.props.onChange(newValue[0]);
            }
          }
        });
      });
    });
  };

  handleSearch = (event) => {
    const { originalOptions, originalSelectedOptions } = this.state;

    if (event === null) {
      this.updateState({
        query: '',
        options: originalOptions,
        selectedOptions: originalSelectedOptions,
      });
    } else {
      const { multiple } = this.props;
      const { target: { value } } = event;

      this.updateState({
        query: value,
        selectedOptions: filterOptionsByQuery(value, originalSelectedOptions),
        options: multiple
          ? filterOptionsByQueryWithMultiple(value, originalOptions, originalSelectedOptions)
          : filterOptionsByQuery(value, originalOptions),
      });
    }
  };

  handleHideSelect = () => (
    this.setState({
      opened: false,
    })
  );

  hasSearchBar = () => {
    const { showSearch } = this.props;

    if (showSearch === null) {
      return this.handleShowSearch();
    }

    const type = typeof showSearch;

    if (type === 'function') {
      return showSearch();
    } if (type === 'boolean') {
      return showSearch;
    }

    throw new Error('Incorrect field value');
  };

  handleMultiInputOptionDeleteClick = option => (e) => {
    const {
      originalOptions,
      originalSelectedOptions,
      toSelectOptions,
    } = this.state;

    e.stopPropagation();

    const mergedOptions = [...originalSelectedOptions, ...toSelectOptions];

    const newSelectedOptions = mergedOptions.filter(o => o.value !== option.value);
    const newOptions = originalOptions.filter(o => !newSelectedOptions.includes(o));

    this.updateState({
      options: newOptions,
      selectedOptions: newSelectedOptions,
      originalSelectedOptions: newSelectedOptions,
      toSelectOptions: [],
      dirty: true,
    }, () => {
      this.props.onChange(newSelectedOptions.map(o => o.value));
    });
  };

  handleKeyDown = (e) => {
    // Skip any interactions if options not loaded yet or select is disabled
    if (!this.state.options.length || this.props.disabled) {
      return;
    }

    // Cancel selection and close options block
    if (['Escape', 'Tab'].includes(e.code) && this.state.opened) {
      e.stopPropagation();

      this.updateState({ toSelectOptions: [], dirty: true }, this.handleClose);

      return;
    }

    // Open select options if pressed SPACE button
    if (['Space', 'ArrowDown', 'ArrowUp'].includes(e.code) && !this.state.opened) {
      e.preventDefault();

      this.setState({ opened: true });

      return;
    }

    // Close select options if pressed ENTER or SPACE button and select was opened
    if (['Enter', 'Space'].includes(e.code) && this.state.opened) {
      e.preventDefault();
      e.stopPropagation();

      this.handleClose();
    }

    // Execute click on first "submit" element in closest forms if enter was pressed and select isn't opened
    if (e.code === 'Enter' && !this.state.opened) {
      const form = this.optionsContainerRef.closest('form');
      const submitElement = form?.querySelectorAll('[type=submit]');

      submitElement[0]?.click();
    }

    // Control arrow down/up pressing when single select in focus
    if (['ArrowDown', 'ArrowUp'].includes(e.code) && !this.props.multiple) {
      e.preventDefault();

      const currentOption = this.state.toSelectOptions[0] || this.state.originalSelectedOptions[0];
      const currentOptionIndex = this.state.options.findIndex(({ key }) => key === currentOption?.key);

      let nextOptionIndex = 0;
      if (e.code === 'ArrowUp') {
        nextOptionIndex = currentOptionIndex > 0 ? currentOptionIndex - 1 : this.state.options.length - 1;
      }

      if (e.code === 'ArrowDown' && this.state.options.length > currentOptionIndex + 1) {
        nextOptionIndex = this.state.options.length > currentOptionIndex + 1 ? currentOptionIndex + 1 : 0;
      }

      const nextOption = this.state.options[nextOptionIndex];

      this.updateState({ toSelectOptions: [nextOption], dirty: true }, () => {
        const optionTop = this.activeOptionRef.offsetTop;
        const optionHeight = this.activeOptionRef.offsetHeight + 10; // 10 is padding for option
        const containerScrollTop = this.optionsContainerRef.scrollTop;
        const containerHeight = this.optionsContainerRef.offsetHeight;

        if (optionTop + optionHeight > containerScrollTop + containerHeight) {
          this.optionsContainerRef.scrollTop = optionTop - containerHeight + optionHeight;
        }

        if (optionTop < containerScrollTop) {
          this.optionsContainerRef.scrollTop = optionTop;
        }
      });
    }
  };

  renderLabel = () => {
    const { originalSelectedOptions, toSelectOptions } = this.state;
    const {
      disabled,
      multiple,
      multipleLabel,
      placeholder: inputPlaceholder,
      singleOptionComponent,
      withArrowDown,
      customArrowComponent,
    } = this.props;

    let placeholder = inputPlaceholder;
    let isMultipleLabel = false;

    if (multiple) {
      if (originalSelectedOptions.length) {
        if (multipleLabel) {
          isMultipleLabel = true;

          placeholder = (
            <div className="Select__placeholder-options">
              {originalSelectedOptions.slice(0, 3).map(option => (
                <div key={option.value} className="Select__placeholder-option">
                  {option.label}
                  <i
                    className="icon icon-times Select__placeholder-option-delete"
                    onClick={this.handleMultiInputOptionDeleteClick(option)}
                  />
                </div>
              ))}
              {originalSelectedOptions.length > 3 && I18n.t('common.select.label_more', {
                value: originalSelectedOptions.length - 3,
              })}
            </div>
          );
        } else {
          placeholder = originalSelectedOptions.length === 1
            ? originalSelectedOptions[0].label
            : `${originalSelectedOptions.length} ${I18n.t('common.select.options_selected')}`;
        }
      }
    } else {
      const OptionCustomComponent = singleOptionComponent;
      let option = toSelectOptions.length
        ? toSelectOptions[0] : null;

      if (!option && originalSelectedOptions.length) {
        [option] = originalSelectedOptions;
      }

      if (option) {
        placeholder = (
          <Choose>
            <When condition={OptionCustomComponent}>
              <OptionCustomComponent {...option.props} hideSelect={this.handleHideSelect} selected />
            </When>
            <Otherwise>
              {option.label}
            </Otherwise>
          </Choose>
        );
      }
    }

    return (
      <Choose>
        <When condition={customArrowComponent}>
          <span onClick={this.handleInputClick}>
            {customArrowComponent}
          </span>
        </When>
        <Otherwise>
          <div
            tabIndex={disabled ? -1 : 0} // eslint-disable-line
            onKeyDown={this.handleKeyDown}
            className={classNames('Select__form-control', 'Select__label', {
              'Select__label--multipleLabel': isMultipleLabel,
            })}
            onClick={this.handleInputClick}
          >
            <If condition={withArrowDown}>
              <i className="icon icon-arrow-down Select__icon" />
            </If>
            {placeholder}
          </div>
        </Otherwise>
      </Choose>
    );
  };

  renderOptions = () => {
    const {
      query,
      options,
      originalSelectedOptions,
      toSelectOptions,
    } = this.state;

    const {
      multiple,
      singleOptionComponent,
      name,
      withGroup,
    } = this.props;

    const filteredOptions = filterOptionsByQuery(query, originalSelectedOptions);

    return (
      <Choose>
        <When condition={multiple}>
          <If condition={originalSelectedOptions}>

            {/* Selected options */}
            <SelectMultipleOptions
              className="Select__selected-options"
              headerText={I18n.t('common.select.selected_options')}
              headerButtonClassName="Select__clear-selected-options"
              headerButtonIconClassName="icon icon-times"
              headerButtonText={I18n.t('common.select.clear')}
              headerButtonOnClick={this.handleResetSelectedOptions}
              options={filteredOptions}
              selectedOptions={originalSelectedOptions}
              onChange={this.handleDeleteSelectedOption}
            />
          </If>

          {/* Available options */}
          <SelectMultipleOptions
            className="Select__selected-options"
            headerText={I18n.t('common.select.available_options')}
            headerButtonClassName={classNames({
              'Select__select-all-options': options.length !== toSelectOptions.length,
              'Select__clear-selected-options': options.length === toSelectOptions.length,
            })}
            headerButtonIconClassName={classNames({
              'fa fa-check-square': options.length !== toSelectOptions.length,
              'icon icon-times': options.length === toSelectOptions.length,
            })}
            headerButtonText={options.length === toSelectOptions.length ? I18n.t('COMMON.CLEAR') : I18n.t('COMMON.ALL')}
            headerButtonOnClick={this.toggleSelectAllOptions}
            options={difference(options, originalSelectedOptions)}
            selectedOptions={[...originalSelectedOptions, ...toSelectOptions]}
            onChange={this.handleSelectMultipleOptions}
            name={name}
          />
        </When>

        <When condition={withGroup}>
          <SelectGroupOptions
            withGroup={withGroup}
            options={options}
            selectedOption={toSelectOptions[0] || originalSelectedOptions[0]}
            onChange={this.handleSelectSingleOption}
            bindActiveOption={this.bindActiveOptionRef}
            handleSelectHide={this.handleHideSelect}
            optionComponent={singleOptionComponent}
          />
        </When>

        <Otherwise>

          {/* Single option */}
          <SelectSingleOptions
            options={options}
            selectedOption={toSelectOptions[0] || originalSelectedOptions[0]}
            onChange={this.handleSelectSingleOption}
            bindActiveOption={this.bindActiveOptionRef}
            handleSelectHide={this.handleHideSelect}
            optionComponent={singleOptionComponent}
          />
        </Otherwise>
      </Choose>
    );
  };

  renderSelectContent = () => {
    const {
      query,
      options,
    } = this.state;

    const {
      customSelectBlockClassName,
      customSelectBlockContainerClassName,
      searchPlaceholder,
      optionsHeader: OptionsHeaderComponent,
    } = this.props;

    const showSearchBar = this.hasSearchBar();

    return (
      <div className={classNames('Select__content', customSelectBlockClassName)}>
        <If condition={showSearchBar}>
          <SelectSearchBox
            query={query}
            placeholder={searchPlaceholder || I18n.t('common.select.default_placeholder')}
            onChange={this.handleSearch}
            ref={this.bindSearchBarRef}
          />
        </If>

        <div
          className={classNames('Select__container', customSelectBlockContainerClassName)}
          ref={this.bindContainerRef}
        >
          <If condition={OptionsHeaderComponent}>
            <OptionsHeaderComponent />
          </If>

          <If condition={query && options.length === 0}>
            <div className="Select__not-found">
              {I18n.t('common.select.options_not_found', { query })}
            </div>
          </If>
          {this.renderOptions()}
        </div>
      </div>
    );
  };

  render() {
    const {
      opened,
      selectedOptions,
    } = this.state;

    const {
      id,
      disabled,
      customClassName,
      isFocused,
      hasTargetPortal,
    } = this.props;

    const selectClasses = {
      'Select__is-opened': opened,
      'Select__with-option': !!selectedOptions.length > 0,
      'Select__is-disabled': disabled,
      'Select__is-focused': isFocused,
      [customClassName]: customClassName,
    };

    return (
      <div
        className={classNames('Select', selectClasses)}
        id={id}
        ref={this.selectRef}
      >
        {this.renderLabel()}

        <Choose>
          <When condition={!!hasTargetPortal}>
            <Popover
              target={this.selectRef?.current}
              isOpen={opened}
              placement="bottom"
              popperClassName="Select__popover"
            >
              <div className={classNames(selectClasses)}>
                {this.renderSelectContent()}
              </div>
            </Popover>
          </When>

          <Otherwise>
            {this.renderSelectContent()}
          </Otherwise>
        </Choose>
      </div>
    );
  }
}

export default compose(
  onClickOutside,
)(Select);
