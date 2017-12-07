import React, { Component } from 'react';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import './FiltersSelect.scss';
import SelectSingleOptions from '../../Select/SelectSingleOptions';
import SelectSearchBox, { filterOptionsByQuery } from '../../Select/SelectSearchBox';
import shallowEqual from '../../../utils/shallowEqual';

class FiltersSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      label: PropTypes.string,
    })).isRequired,
  };

  constructor(props) {
    super(props);

    const originalOptions = props.options.map(this.mapOptions);
    this.state = {
      opened: false,
      query: '',
      originalOptions,
      options: originalOptions,
      withSearchBar: originalOptions.length > 5,
    };
  }

  componentWillReceiveProps({ options: nextOptions }) {
    const { options } = this.props;

    if (!shallowEqual(options, nextOptions)) {
      const originalOptions = nextOptions.map(this.mapOptions);

      this.setState({
        originalOptions,
        options: originalOptions,
        withSearchBar: originalOptions.length > 5,
      });
    }
  }

  mapOptions = option => ({ key: option.uuid, label: option.label, value: option.uuid });

  handleIconClick = () => {
    if (!this.state.opened) {
      this.handleOpen();
    } else {
      this.handleClose();
    }
  };

  handleOpen = () => {
    if (!this.state.opened) {
      this.setState({ opened: true });
    }
  };

  handleClose = () => {
    this.setState({ opened: false });
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
        options: filterOptionsByQuery(e.target.value, this.state.options),
      });
    }
  };

  handleClickOutside = () => {
    if (this.state.opened) {
      this.handleClose();
    }
  };

  handleChange = (option) => {
    this.handleClose();
    this.props.onChange(option.value);
  };

  render() {
    const { opened, query, options, withSearchBar } = this.state;
    const className = classNames('select-block', {
      'is-opened': opened,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': withSearchBar,
    });

    return (
      <div className="filter-row__advanced-select">
        <button
          className={classNames('filters-select', { 'filters-select_active': opened })}
          onClick={this.handleIconClick}
          type="button"
        >
          <i className="nas nas-add_filter_icon" />
        </button>
        <div className={className}>
          <div className={selectBlockClassName}>
            {
              withSearchBar &&
              <SelectSearchBox
                query={query}
                onChange={this.handleSearch}
              />
            }
            {
              query && options.length === 0 &&
              <div className="text-muted font-size-10 margin-10">
                Options by query "{query}" not found...
              </div>
            }
            <div className="select-block__container">
              <SelectSingleOptions
                onChange={this.handleChange}
                options={options}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(FiltersSelect);
