import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';

class Select extends Component {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    onChange: PropTypes.func,
    showSearch: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    placeholder: PropTypes.string,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  };
  static defaultProps = {
    onChange: null,
    showSearch: null,
    placeholder: 'Any',
    multiple: false,
    value: null,
  };

  state = {
    opened: false,
  };

  handleShowSearch = () => this.props.children.length > 5;

  handleInputClick = () => {
    this.setState({ opened: !this.state.opened });
  };

  handleClickOutside = () => {
    this.setState({ opened: false });
  };

  handleChange = (value) => {
    this.props.onChange(value);
  };

  handleSearch = (e) => {

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

  renderSearchBar = () => (
    <div className="select-search-bar input-with-icon input-with-icon__left input-with-icon__right">
      <i className="nas nas-search_icon input-left-icon" />
      <input
        type="text"
        name="searchValue"
        className="form-control"
        placeholder="Search"
      />
      <i className="nas nas-clear_icon input-right-icon" />
    </div>
  );

  render() {
    const { opened, searched, selected } = this.state;
    const { placeholder, value: selectedValue, multiple } = this.props;
    const options = this.props.children.filter(option => option.type === 'option');
    const selectedOption = options.find(option => option.props.value === selectedValue);

    const showSearchBar = this.hasSearchBar();
    const className = classNames('form-control select-block', {
      'is-opened': opened,
      'with-option': !!selectedOption,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': showSearchBar,
    });

    return (
      <div className={className} onClick={this.handleInputClick}>
        <i className="nas nas-dropdown_arrow_icon select-icon" />
        {selectedOption ? selectedOption.props.children : placeholder}

        <div className={selectBlockClassName}>
          {showSearchBar && this.renderSearchBar()}
          <div className="select-block__options">
            {options.map((option) => {
              const { key, props: { value, children } } = option;
              const optionClassName = classNames('select-block__options-item', {
                'is-selected': selectedValue === value,
              });

              return (
                <div className={optionClassName} key={key} onClick={() => this.handleChange(value)}>
                  {children}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(Select);
