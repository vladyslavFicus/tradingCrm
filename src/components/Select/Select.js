import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import shallowEqual from '../../utils/shallowEqual';
import SelectSearchBox from './SelectSearchBox';
import SelectSingleOptions from './SelectSingleOptions';
import SelectMultipleOptions from './SelectMultipleOptions';
import deleteFromArray from '../../utils/deleteFromArray';

class Select extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    showSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    searchPlaceholder: PropTypes.string,
  };
  static defaultProps = {
    onChange: null,
    showSearch: null,
    placeholder: 'Any',
    multiple: false,
    value: null,
    searchPlaceholder: 'Search',
  };

  constructor(props) {
    super(props);

    const originalOptions = this.filterOptions(props.children);
    const selectedOptions = props.multiple
      ? originalOptions.filter(option => props.value.indexOf(option.value) > -1)
      : [originalOptions.find(option => option.value === props.value)];

    this.state = {
      opened: false,
      query: '',
      originalOptions,
      options: this.filterSelectedOptions(originalOptions, selectedOptions, props.multiple),
      originalSelectedOptions: selectedOptions,
      selectedOptions,
      toSelectOptions: [],
    };
    this.optionsRef = null;
  }

  componentWillReceiveProps(nextProps) {
    const { query, originalOptions } = this.state;
    const { children, value } = this.props;
    let options = originalOptions;

    if (!shallowEqual(children, nextProps.children)) {
      options = this.filterOptions(nextProps.children);

      this.setState({
        originalOptions: options,
        options: this.filterOptionsByQuery(query, options),
      });
    }

    if (!shallowEqual(value, nextProps.value)) {
      const originalSelectedOptions = nextProps.multiple
        ? originalOptions.filter(option => nextProps.value.indexOf(option.value) > -1)
        : [originalOptions.find(option => option.value === nextProps.value)];
      this.setState({
        options: this.filterSelectedOptions(originalOptions, originalSelectedOptions, nextProps.multiple),
        originalSelectedOptions,
        selectedOptions: this.filterOptionsByQuery(query, originalSelectedOptions),
      });
    }
  }

  bindOptionsRef = (node) => {
    this.optionsRef = node;
  };

  bindContainerRef = (node) => {
    this.optionsContainerRef = node;
  };

  handleShowSearch = () => this.props.children.length > 5;

  handleInputClick = () => {
    this.handleOpen();
  };

  handleClickOutside = () => {
    this.handleClose();
  };

  handleSelectSingleOption = (option) => {
    this.setState({ toSelectOptions: [option] }, this.handleClose);
  };

  handleSelectMultipleOptions = (options) => {
    this.setState({ toSelectOptions: options });
  };

  handleResetSelectedOptions = () => {
    this.setState({ toSelectOptions: [], selectedOptions: [], originalSelectedOptions: [] });
  };

  handleDeleteSelectedOption = (options) => {
    const { query, originalSelectedOptions, originalOptions } = this.state;
    const { multiple } = this.props;
    const deletedOptions = originalSelectedOptions.filter(option => options.indexOf(option) === -1);
    const newOriginalSelectedOptions = deletedOptions
      .reduce((res, option) => deleteFromArray(res, option), originalSelectedOptions);

    if (originalSelectedOptions.length !== newOriginalSelectedOptions.length) {
      this.setState({
        options: this.filterSelectedOptions(originalOptions, originalSelectedOptions, multiple),
        originalSelectedOptions: newOriginalSelectedOptions,
        selectedOptions: this.filterOptionsByQuery(query, newOriginalSelectedOptions),
      });
    }
  };

  handleOpen = () => {
    if (!this.state.opened) {
      this.setState({ opened: true }, () => {
        const { multiple } = this.props;

        if (multiple) {
          this.optionsContainerRef.scrollTop = 0;
        }
      });
    }
  };

  handleClose = () => {
    const { toSelectOptions, originalOptions, originalSelectedOptions } = this.state;
    const { multiple, value } = this.props;
    const previousValue = multiple ? value : [value];
    const newValue = [...originalSelectedOptions, ...toSelectOptions].map(option => option.value);

    this.setState({ opened: false }, () => {
      setTimeout(() => {
        this.setState({
          query: '',
          options: originalOptions,
          toSelectOptions: [],
          selectedOptions: originalSelectedOptions,
        }, () => {
          if (!shallowEqual(previousValue, newValue)) {
            if (multiple) {
              this.props.onChange(newValue);
            } else {
              this.props.onChange(newValue[0].value);
            }
          }
        });
      }, 150);
    });
  };

  handleSearch = (e) => {
    if (e === null) {
      this.setState({
        query: '',
        options: this.state.originalOptions,
        selectedOptions: this.state.originalSelectedOptions,
      });
    } else {
      this.setState({
        query: e.target.value,
        options: this.filterOptionsByQuery(e.target.value, this.state.originalOptions),
        selectedOptions: this.filterOptionsByQuery(e.target.value, this.state.originalSelectedOptions),
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

  filterOptions = options => options
    .filter(option => option.type === 'option')
    .map(option => ({
      label: option.props.children,
      value: option.props.value,
      key: option.key,
    }));

  filterSelectedOptions = (options, selectedOptions, multiple) => (
    multiple
      ? options.filter(option => selectedOptions.indexOf(option) === -1)
      : options
  );

  filterOptionsByQuery = (query, options) => {
    if (query === '') {
      return options;
    }
    const lowerCasedQuery = query.toLowerCase();

    return options.filter(option => option.label.toLowerCase().indexOf(lowerCasedQuery) > -1);
  };

  renderSelectedOptions = (options, selectedOptions) => (
    <SelectMultipleOptions
      className="select-block__selected-options"
      headerText="selected options"
      headerButtonClassName="clear-selected-options"
      headerButtonIconClassName="nas nas-clear_icon"
      headerButtonText="Clear"
      headerButtonOnClick={this.handleResetSelectedOptions}
      options={options}
      selectedOptions={selectedOptions}
      onChange={this.handleDeleteSelectedOption}
    />
  );

  renderLabel = () => {
    const { originalSelectedOptions, toSelectOptions } = this.state;
    const { multiple, placeholder } = this.props;

    if (multiple) {
      const mergedOptions = [...originalSelectedOptions, ...toSelectOptions];

      if (mergedOptions.length) {
        return mergedOptions.length === 1
          ? mergedOptions[0].label
          : `${mergedOptions.length} options selected`;
      }
    } else if (toSelectOptions.length) {
      return toSelectOptions[0].label;
    } else if (originalSelectedOptions.length) {
      return originalSelectedOptions[0].label;
    }

    return placeholder;
  };

  renderOptions = (options, selectedOptions, toSelectOptions, multiple) => (multiple
    ? (
      <SelectMultipleOptions
        headerText="available options"
        options={options}
        selectedOptions={toSelectOptions}
        onChange={this.handleSelectMultipleOptions}
      />
    )
    : (
      <SelectSingleOptions
        options={options}
        selectedOption={selectedOptions[0]}
        onChange={this.handleSelectSingleOption}
        ref={this.bindOptionsRef}
      />
    ));

  render() {
    const { query, opened, options, selectedOptions, originalSelectedOptions, toSelectOptions } = this.state;
    const { multiple, searchPlaceholder } = this.props;

    const showSearchBar = this.hasSearchBar();
    const className = classNames('form-control select-block', {
      'is-opened': opened,
      'with-option': !!selectedOptions.length > 0,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': showSearchBar,
      'with-multiselect': multiple,
    });

    return (
      <div className={className} onClick={this.handleInputClick}>
        <i className="nas nas-dropdown_arrow_icon select-icon" />
        {this.renderLabel()}

        <div className={selectBlockClassName}>
          {
            showSearchBar &&
            <SelectSearchBox
              query={query}
              placeholder={searchPlaceholder}
              onChange={this.handleSearch}
            />
          }
          <div className="select-block__container" ref={this.bindContainerRef}>
            {multiple && this.renderSelectedOptions(originalSelectedOptions, selectedOptions)}
            {
              !!query && options.length === 0 &&
              <span className="text-muted font-size-10 margin-10">
                Options by query {`"${query}"`} not found...
              </span>
            }
            {this.renderOptions(options, originalSelectedOptions, toSelectOptions, multiple)}
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(Select);
