import React, { PureComponent } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import shallowEqual from '../../utils/shallowEqual';
import SelectSearchBox, { filterOptionsByQuery } from './SelectSearchBox';
import SelectSingleOptions from './SelectSingleOptions';
import SelectMultipleOptions from './SelectMultipleOptions';
import deleteFromArray from '../../utils/deleteFromArray';

class Select extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.node]).isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.object]),
    showSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    searchPlaceholder: PropTypes.string,
    optionsHeader: PropTypes.func,
    singleOptionComponent: PropTypes.func,
    disabled: PropTypes.bool,
    customClassName: PropTypes.string,
    id: PropTypes.string,
  };
  static defaultProps = {
    onChange: null,
    showSearch: null,
    placeholder: 'Any',
    multiple: false,
    value: null,
    searchPlaceholder: null,
    optionsHeader: null,
    singleOptionComponent: null,
    disabled: false,
    customClassName: null,
    id: null,
  };

  constructor(props) {
    super(props);

    const originalOptions = this.filterOptions(props.children);
    const selectedOptions = props.multiple
      ? originalOptions.filter(option => props.value.indexOf(option.value) > -1)
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
        ? options.filter(option => value.indexOf(option.value) > -1)
        : [options.find(option => option.value === value)].filter(option => option);

      this.updateState({
        originalOptions: options,
        options: this.filterSelectedOptions(filterOptionsByQuery(query, [...options]), selectedOptions, multiple),
        selectedOptions,
        originalSelectedOptions: selectedOptions,
      });
    }

    if (!this.shallowEqual(value, nextProps.value)) {
      const originalSelectedOptions = nextProps.multiple
        ? originalOptions.filter(option => nextProps.value.indexOf(option.value) > -1)
        : [originalOptions.find(option => option.value === nextProps.value)].filter(option => option);
      this.updateState({
        options: this.filterSelectedOptions(originalOptions, originalSelectedOptions, nextProps.multiple),
        originalSelectedOptions,
        selectedOptions: filterOptionsByQuery(query, originalSelectedOptions),
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mounted = false;

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  shallowEqual = (current, next) => {
    const currentType = typeof current;
    const nextType = typeof next;

    if (currentType !== 'object' && nextType !== 'object') {
      return current === next;
    }

    return shallowEqual(current, next);
  };

  bindRef = name => (node) => {
    this[name] = node;
  };

  bindSearchBarRef = this.bindRef('searchBarRef');

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

    // If not all options selected --> select all
    if (toSelectOptions.length !== options.length) {
      this.updateState({
        toSelectOptions: [...options],
        options: [...options],
      });
    } else {
      this.updateState({ toSelectOptions: [] });
    }
  };

  handleDeleteSelectedOption = (options) => {
    const { query, originalSelectedOptions } = this.state;
    const deletedOptions = originalSelectedOptions.filter(option => options.indexOf(option) === -1);
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
    const previousValue = multiple ? value : [value];
    let newValue = multiple
      ? [...originalSelectedOptions, ...toSelectOptions]
      : [...toSelectOptions];
    newValue = newValue.map(option => option.value);

    this.updateState({ opened: false }, () => {
      requestAnimationFrame(() => {
        this.updateState({
          query: '',
          options: originalOptions,
          toSelectOptions: [],
          selectedOptions: [...originalSelectedOptions],
        }, () => {
          if (!shallowEqual(previousValue, newValue)) {
            newValue = Array.isArray(newValue) && !newValue.length ? null : newValue;

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

  handleSearch = (e) => {
    if (e === null) {
      this.updateState({
        query: '',
        options: this.state.originalOptions,
        selectedOptions: this.state.originalSelectedOptions,
      });
    } else {
      this.updateState({
        query: e.target.value,
        options: filterOptionsByQuery(e.target.value, this.state.originalOptions),
        selectedOptions: filterOptionsByQuery(e.target.value, this.state.originalSelectedOptions),
      });
    }
  };

  hasSearchBar = () => {
    const { showSearch } = this.props;

    if (showSearch === null) {
      return this.handleShowSearch();
    }

    const type = typeof showSearch;

    if (type === 'function') {
      return showSearch();
    } else if (type === 'boolean') {
      return showSearch;
    }

    throw new Error('Incorrect field value');
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
    : []
  );

  filterSelectedOptions = (options, selectedOptions, multiple) => (
    multiple
      ? options.filter(option => selectedOptions.indexOf(option) === -1)
      : options
  );

  renderSelectedOptions = (options, selectedOptions) => (
    <SelectMultipleOptions
      className="select-block__selected-options"
      headerText="selected options"
      headerButtonClassName="clear-selected-options"
      headerButtonIconClassName="icon icon-times"
      headerButtonText="Clear"
      headerButtonOnClick={this.handleResetSelectedOptions}
      options={options}
      selectedOptions={selectedOptions}
      onChange={this.handleDeleteSelectedOption}
    />
  );

  renderLabel = () => {
    const { originalSelectedOptions, toSelectOptions } = this.state;
    const { multiple, placeholder: inputPlaceholder, singleOptionComponent } = this.props;
    let placeholder = inputPlaceholder;

    if (multiple) {
      const mergedOptions = [...originalSelectedOptions, ...toSelectOptions];

      if (mergedOptions.length) {
        placeholder = mergedOptions.length === 1
          ? mergedOptions[0].label
          : `${mergedOptions.length} options selected`;
      }
    } else {
      const OptionCustomComponent = singleOptionComponent;
      let option = toSelectOptions.length
        ? toSelectOptions[0] : null;

      if (!option && originalSelectedOptions.length) {
        option = originalSelectedOptions[0];
      }

      if (option) {
        placeholder = OptionCustomComponent
          ? <OptionCustomComponent {...option.props} />
          : option.label;
      }
    }

    return (
      <div className="form-control select-block__label" onClick={this.handleInputClick}>
        <i className="icon icon-arrow-down select-icon" />
        {placeholder}
      </div>
    );
  };

  renderOptions = (
    {
      options,
      originalSelectedOptions,
      toSelectOptions,
      multiple,
      singleOptionComponent,
      name,
    }
  ) => (
    multiple
      ? (
        <SelectMultipleOptions
          className="select-block__selected-options"
          headerText={I18n.t('common.select.available_options')}
          headerButtonClassName={classNames({
          'select-all-options': options.length !== toSelectOptions.length,
          'clear-selected-options': options.length === toSelectOptions.length,
        })}
          headerButtonIconClassName={classNames({
            'fa fa-check-square': options.length !== toSelectOptions.length,
            'icon icon-times': options.length === toSelectOptions.length,
          })}
          headerButtonText={options.length === toSelectOptions.length ? 'Clear' : I18n.t('COMMON.ALL')}
          headerButtonOnClick={this.toggleSelectAllOptions}
          options={options}
          selectedOptions={toSelectOptions}
          onChange={this.handleSelectMultipleOptions}
          name={name}
        />
      )
      : (
        <SelectSingleOptions
          options={options}
          selectedOption={originalSelectedOptions[0]}
          onChange={this.handleSelectSingleOption}
          bindActiveOption={this.bindActiveOptionRef}
          optionComponent={singleOptionComponent}
        />
      )
  );

  render() {
    const {
      query,
      opened,
      options,
      selectedOptions,
      originalSelectedOptions,
      toSelectOptions,
    } = this.state;
    const {
      multiple,
      searchPlaceholder,
      optionsHeader,
      singleOptionComponent,
      disabled,
      customClassName,
      id,
      name,
    } = this.props;

    const OptionsHeaderComponent = optionsHeader;
    const showSearchBar = this.hasSearchBar();
    const className = classNames('select-block', {
      'is-opened': opened,
      'with-option': !!selectedOptions.length > 0,
      'is-disabled': disabled,
      [customClassName]: customClassName,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': showSearchBar,
      'with-multiselect': multiple,
    });

    return (
      <div className={className} id={id}>
        {this.renderLabel()}

        <div className={selectBlockClassName}>
          {
            showSearchBar &&
            <SelectSearchBox
              query={query}
              placeholder={searchPlaceholder || I18n.t('common.select.default_placeholder')}
              onChange={this.handleSearch}
              ref={this.bindSearchBarRef}
            />
          }
          <div className="select-block__container" ref={this.bindContainerRef}>
            {OptionsHeaderComponent && <OptionsHeaderComponent />}
            {multiple && this.renderSelectedOptions(originalSelectedOptions, selectedOptions)}
            {
              !!query && options.length === 0 &&
              <div className="text-muted font-size-10 margin-10">
                {I18n.t('common.select.options_not_found', { query })}
              </div>
            }
            {this.renderOptions(
              {
                options,
                originalSelectedOptions,
                toSelectOptions,
                multiple,
                singleOptionComponent,
                name,
              }
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(Select);
