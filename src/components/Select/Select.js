import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import shallowEqual from '../../utils/shallowEqual';
import SelectSearchBox from './SelectSearchBox';
import SelectSingleOptions from './SelectSingleOptions';
import SelectMultipleOptions from './SelectMultipleOptions';

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
      this.setState({
        selectedOptions: nextProps.multiple
          ? originalOptions.filter(option => nextProps.value.indexOf(option.value) > -1)
          : [originalOptions.find(option => option.value === nextProps.value)],
      });
    }
  }

  bindOptionsRef = (node) => {
    this.optionsRef = node;
  };

  handleShowSearch = () => this.props.children.length > 5;

  handleInputClick = (e) => {
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
    this.setState({ toSelectOptions: [] });
  };

  handleDeleteSelectedOption = (option) => {
    const index = this.state.selectedOptions.indexOf(option);

    if (index) {
      const newSelectedOptions = [...this.state.selectedOptions];
      newSelectedOptions.splice(index, 1);

      this.setState({ selectedOptions: newSelectedOptions });
    }
  };

  handleOpen = () => {
    if (!this.state.opened) {
      this.setState({ opened: true }, () => {
        console.log(this.optionsRef);
      });
    }
  };

  handleClose = () => {
    const { toSelectOptions, selectedOptions, originalOptions } = this.state;
    const { multiple } = this.props;


    this.setState({ opened: false }, () => {
      setTimeout(() => {
        this.setState({ query: '', options: originalOptions, toSelectOptions: [] }, () => {
          if (toSelectOptions.length > 0) {
            if (multiple) {
              const values = [...selectedOptions, ...toSelectOptions].map(option => option.value);

              this.props.onChange(multiple ? values : values[0]);
            } else {
              this.props.onChange(toSelectOptions[0].value);
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
      });
    } else {
      this.setState({
        query: e.target.value,
        options: this.filterOptionsByQuery(e.target.value, this.state.originalOptions),
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

  renderSelectedOptions = options => (
    <div className="with-multiselect_checked-block">
      <div className="select-block_menu-heading">
        selected options
      </div>
      <button className="clear-selected" onClick={this.handleResetSelectedOptions}>
        <i className="nas nas-clear_icon icon-in-input" /> Clear
      </button>
      {options.map(option => (
        <label key={option.key} className="control control--checkbox select-block_menu-checkbox is-selected">
          {option.label}
          <input type="checkbox" checked onChange={e => this.handleDeleteSelectedOption(option)} />
          <div className="control__indicator is-checked">
            <i className="nas nas-check_box" />
          </div>
        </label>
      ))}
    </div>
  );

  renderLabel = () => {
    const { selectedOptions, toSelectOptions } = this.state;
    const { multiple, placeholder } = this.props;

    if (multiple) {
      const mergedOptions = [...selectedOptions, ...toSelectOptions];

      if (mergedOptions.length) {
        return mergedOptions.length === 1
          ? mergedOptions[0].label
          : `${mergedOptions.length} options selected`;
      }
    } else if (toSelectOptions.length) {
      return toSelectOptions[0].label;
    } else if (selectedOptions.length) {
      return selectedOptions[0].label;
    }

    return placeholder;
  };

  renderOptions = (options, selectedOptions, toSelectOptions, multiple) => {
    return multiple
      ? (
        <SelectMultipleOptions
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
      );
  };

  render() {
    const { query, opened, options, selectedOptions, toSelectOptions } = this.state;
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
          {multiple && this.renderSelectedOptions(selectedOptions)}
          {
            !!query && options.length === 0 &&
            <span className="text-muted font-size-10 margin-10">
              Options by query {`"${query}"`} not found...
            </span>
          }
          {this.renderOptions(options, selectedOptions, toSelectOptions, multiple)}
        </div>
      </div>
    );
  }
}

export default onClickOutside(Select);
