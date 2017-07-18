import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import shallowEqual from '../../utils/shallowEqual';

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
    this.state = {
      opened: false,
      query: '',
      originalOptions,
      options: originalOptions,
      selectedOptions: [originalOptions.find(option => option.value === props.value)],
      toSelectOptions: [],
    };
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
        selectedOptions: [options.find(option => option.value === nextProps.value)],
      });
    }
  }

  handleShowSearch = () => this.props.children.length > 5;

  handleInputClick = (e) => {
    this.handleOpen();
  };

  handleClickOutside = () => {
    this.handleClose();
  };

  handleSelectSingleOption = (option) => {
    this.setState({ selectedOptions: [option] }, this.handleClose);
  };

  handleOpen = () => {
    this.setState({ opened: true });
  };

  handleClose = () => {
    const { selectedOptions, originalOptions } = this.state;
    const { multiple } = this.props;


    this.setState({ opened: false }, () => {
      this.setState({ query: '', options: originalOptions }, () => {
        if (selectedOptions.length > 0) {
          const values = selectedOptions.map(option => option.value);

          this.props.onChange(multiple ? values : values[0]);
        }
      });
    });
  };

  handleSearch = (e) => {
    this.setState({
      query: e.target.value,
      options: this.filterOptionsByQuery(e.target.value, this.state.originalOptions),
    });
  };

  handleResetSearch = () => {
    this.setState({ query: '', options: this.state.originalOptions });
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

  filterOptions = (options) => {
    return options
      .filter(option => option.type === 'option')
      .map(option => ({
        label: option.props.children,
        value: option.props.value,
        key: option.key,
      }));
  };

  filterOptionsByQuery = (query, options) => {
    if (query === '') {
      return options;
    }

    const queryRegExp = new RegExp(`/${query}/`, 'i');

    return options.filter(option => queryRegExp.test(option.label));
  };

  renderSearchBar = () => {
    const { query } = this.state;
    const { searchPlaceholder } = this.props;
    const className = classNames('select-search-bar input-with-icon input-with-icon__left', {
      'input-with-icon__right': !!query,
    });

    return (
      <div className={className}>
        <i className="nas nas-search_icon input-left-icon" />
        <input
          type="text"
          className="form-control"
          placeholder={searchPlaceholder}
          onChange={this.handleSearch}
          value={query}
        />
        {!!query && <i className="nas nas-clear_icon input-right-icon" onClick={this.handleResetSearch} />}
      </div>
    );
  };

  renderSingleOptions = (options, selectedOption) => (
    <div className="select-block__options">
      {options.map((option) => {
        const isActive = selectedOption && selectedOption.value === option.value;
        const optionClassName = classNames('select-block__options-item', {
          'is-selected': isActive,
        });

        return (
          <div
            key={option.key}
            className={optionClassName}
            onClick={() => this.handleSelectSingleOption(option)}
          >
            {option.label}
          </div>
        );
      })}
    </div>
  );

  render() {
    const { query, opened, options, selectedOptions, toSelectOptions } = this.state;
    const { placeholder, multiple } = this.props;

    const showSearchBar = this.hasSearchBar();
    const className = classNames('form-control select-block', {
      'is-opened': opened,
      'with-option': !!selectedOptions.length > 0,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': showSearchBar,
    });

    return (
      <div className={className} onClick={this.handleInputClick}>
        <i className="nas nas-dropdown_arrow_icon select-icon" />
        {selectedOptions.length > 0 ? selectedOptions[0].label : placeholder}

        <div className={selectBlockClassName}>
          {showSearchBar && this.renderSearchBar()}
          {
            !!query && options.length === 0 &&
            <span className="text-muted font-size-10 margin-10">
              Options by query {`"${query}"`} not found...
            </span>
          }
          {
            multiple
              ? this.renderSingleOptions(options, selectedOptions)
              : this.renderSingleOptions(options, selectedOptions[0])
          }
        </div>
      </div>
    );
  }
}

export default onClickOutside(Select);
