import React, { PureComponent } from 'react';
import { withRouter } from 'react-router-dom';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'react-apollo';
import onClickOutside from 'react-onclickoutside';
import { isObject } from 'lodash';
import shallowEqual from 'utils/shallowEqual';
import deleteFromArray from 'utils/deleteFromArray';
import SelectSearchBox, {
  filterOptionsByQuery,
  filterOptionsByQueryWithMultiple,
} from '../SelectSearchBox/SelectSearchBox';
import SelectSingleOptions from '../SelectSingleOptions/SelectSingleOptions';
import SelectMultipleOptions from '../SelectMultipleOptions/SelectMultipleOptions';
import './Select.scss';

class Select extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.node]).isRequired,
    onChange: PropTypes.func,
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
    id: PropTypes.string,
    isFocused: PropTypes.bool,
    withArrowDown: PropTypes.bool,
    customArrowComponent: PropTypes.object,
  };

  static defaultProps = {
    name: undefined,
    onChange: null,
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
    id: null,
    withArrowDown: true,
    customArrowComponent: null,
    isFocused: false,
  };

  mounted = false;

  constructor(props) {
    super(props);

    const originalOptions = this.filterOptions(props.children);
    const selectedOptions = props.multiple
      ? originalOptions.filter(option => props.value.includes(option.value))
      : [originalOptions.find(option => option.value === props.value)].filter(option => option);

    this.state = {
      opened: false,
      query: '',
      originalOptions,
      options: this.filterSelectedOptions(originalOptions, selectedOptions, props.multiple),
      originalSelectedOptions: selectedOptions,
      selectedOptions,
      toSelectOptions: [],
    };

    this.activeOptionRef = null;
    this.optionsContainerRef = null;
    this.searchBarRef = null;
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillReceiveProps(nextProps) {
    const { query, originalOptions } = this.state;
    const { children, value, multiple } = this.props;
    let options = originalOptions;

    if (!shallowEqual(children, nextProps.children)) {
      options = [...this.filterOptions(nextProps.children)];

      const selectedOptions = multiple
        ? options.filter(option => value.includes(option.value))
        : [options.find(option => option.value === value)].filter(option => option);

      this.updateState({
        originalOptions: options,
        options: this.filterSelectedOptions(filterOptionsByQuery(query, [...options]), selectedOptions, multiple),
        selectedOptions,
        originalSelectedOptions: selectedOptions,
      });
    }

    if (!this.shallowEqual(value, nextProps.value)) {
      const opts = [...this.filterOptions(nextProps.children)];
      // happened when after choosing value, we add more options to select
      if (opts.length > options) {
        options = opts;
      }

      const originalSelectedOptions = nextProps.multiple
        ? options.filter(option => nextProps.value.includes(option.value))
        : [options.find(option => option.value === nextProps.value)].filter(option => option);

      this.updateState({
        ...(opts.length > options && { originalOptions: opts }),
        options: this.filterSelectedOptions(options, originalSelectedOptions, nextProps.multiple),
        originalSelectedOptions,
        selectedOptions: filterOptionsByQuery(query, originalSelectedOptions),
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  shallowEqual = (current, next) => {
    if (!isObject(current) && !isObject(next)) {
      return current === next;
    }

    return shallowEqual(current, next);
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

  handleClickOutside = () => {
    if (this.state.opened) {
      this.handleClose();
    }
  };

  handleSelectSingleOption = (option) => {
    if (option.props.disabled) return;

    this.updateState({ toSelectOptions: [option] }, this.handleClose);
  };

  handleSelectMultipleOptions = (options) => {
    this.updateState({ toSelectOptions: options });
  };

  handleResetSelectedOptions = () => {
    this.updateState({
      options: [...this.state.originalOptions],
      toSelectOptions: [],
      selectedOptions: [],
      originalSelectedOptions: [],
    });
  };

  toggleSelectAllOptions = () => {
    const { toSelectOptions, options } = this.state;
    const notDisabledOptions = options.filter(option => !option.props.disabled);

    // If not all options selected --> select all
    if (toSelectOptions.length !== notDisabledOptions.length) {
      this.updateState({ toSelectOptions: notDisabledOptions });
    } else {
      this.updateState({ toSelectOptions: [] });
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
      });
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
      });
    }
  };

  handleClose = () => {
    const { toSelectOptions, originalOptions, originalSelectedOptions } = this.state;
    const { multiple, value } = this.props;
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
        }, () => {
          if (!shallowEqual(multiple ? value : [value], newValue)) {
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
    }, () => {
      this.props.onChange(newSelectedOptions.map(o => o.value));
    });
  };

  filterOptions = options => (Array.isArray(options)
    ? options
      .filter(option => option.type === 'option')
      .map(({ key, props: { value, children, ...props } }) => ({
        label: children,
        value,
        key,
        props,
      }))
      .sort((currentOption, nextOption) => +currentOption.props.disabled - +nextOption.props.disabled)
    : []
  );

  filterSelectedOptions = (options, selectedOptions, multiple) => (
    multiple
      ? options.filter(option => !selectedOptions.includes(option))
      : options
  );

  renderLabel = () => {
    const { originalSelectedOptions, toSelectOptions } = this.state;
    const {
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
      const mergedOptions = [...originalSelectedOptions, ...toSelectOptions];

      if (mergedOptions.length) {
        if (multipleLabel) {
          isMultipleLabel = true;

          placeholder = (
            <div className="Select__placeholder-options">
              {mergedOptions.slice(0, 3).map(option => (
                <div key={option.value} className="Select__placeholder-option">
                  {option.label}
                  <i
                    className="icon icon-times Select__placeholder-option-delete"
                    onClick={this.handleMultiInputOptionDeleteClick(option)}
                  />
                </div>
              ))}
              {mergedOptions.length > 3 && I18n.t('common.select.label_more', {
                value: mergedOptions.length - 3,
              })}
            </div>
          );
        } else {
          placeholder = mergedOptions.length === 1
            ? mergedOptions[0].label
            : `${mergedOptions.length} ${I18n.t('common.select.options_selected')}`;
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
      <div
        className={classNames('Select__form-control', 'Select__label', {
          'Select__label--multipleLabel': isMultipleLabel,
        })}
        onClick={this.handleInputClick}
      >
        <Choose>
          <When condition={customArrowComponent}>
            {customArrowComponent}
          </When>
          <Otherwise>
            <If condition={withArrowDown}>
              <i className="icon icon-arrow-down Select__icon" />
            </If>
          </Otherwise>
        </Choose>
        {placeholder}
      </div>
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
            options={options}
            selectedOptions={toSelectOptions}
            onChange={this.handleSelectMultipleOptions}
            name={name}
          />
        </When>
        <Otherwise>

          {/* Single option */}
          <SelectSingleOptions
            options={options}
            selectedOption={originalSelectedOptions[0]}
            onChange={this.handleSelectSingleOption}
            bindActiveOption={this.bindActiveOptionRef}
            handleSelectHide={this.handleHideSelect}
            optionComponent={singleOptionComponent}
          />
        </Otherwise>
      </Choose>
    );
  };

  render() {
    const {
      query,
      opened,
      options,
      selectedOptions,
    } = this.state;

    const {
      id,
      searchPlaceholder,
      optionsHeader: OptionsHeaderComponent,
      disabled,
      customClassName,
      isFocused,
    } = this.props;

    const showSearchBar = this.hasSearchBar();

    return (
      <div
        className={classNames('Select', {
          'Select__is-opened': opened,
          'Select__with-option': !!selectedOptions.length > 0,
          'Select__is-disabled': disabled,
          'Select__is-focused': isFocused,
          [customClassName]: customClassName,
        })}
        id={id}
      >
        {this.renderLabel()}

        <div className="Select__content">
          <If condition={showSearchBar}>
            <SelectSearchBox
              query={query}
              placeholder={searchPlaceholder || I18n.t('common.select.default_placeholder')}
              onChange={this.handleSearch}
              ref={this.bindSearchBarRef}
            />
          </If>
          <div className="Select__container" ref={this.bindContainerRef}>
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
      </div>
    );
  }
}

export default compose(
  withRouter,
  onClickOutside,
)(Select);
