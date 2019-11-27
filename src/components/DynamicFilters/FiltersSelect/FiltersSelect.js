import React, { Component } from 'react';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
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

    this.originalOptions = props.options.map(this.mapOptions);
    this.state = {
      opened: false,
      query: '',
      options: this.originalOptions,
      withSearchBar: this.originalOptions.length > 5,
    };
  }

  componentWillReceiveProps({ options: nextOptions }) {
    const { options } = this.props;

    if (!shallowEqual(options, nextOptions)) {
      this.originalOptions = nextOptions.map(this.mapOptions);

      this.setState({
        options: this.originalOptions,
        withSearchBar: this.originalOptions.length > 5,
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
        options: this.originalOptions,
      });
    } else {
      this.setState({
        query: e.target.value,
        options: filterOptionsByQuery(e.target.value, this.originalOptions),
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

  renderOptions = () => {
    const { query, options } = this.state;

    if (query && options.length === 0) {
      return <div className="text-center">{I18n.t('ADVANCED_OPTIONS.FILTERS_NOT_FOUND')}</div>;
    }

    if (options.length === 0) {
      return <div className="text-center">{I18n.t('ADVANCED_OPTIONS.NO_OPTIONS_AVAILABLE')}</div>;
    }

    return (
      <SelectSingleOptions
        onChange={this.handleChange}
        options={options}
      />
    );
  };

  render() {
    const { opened, query, withSearchBar } = this.state;
    const className = classNames('select-block', {
      'is-opened': opened,
    });
    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': withSearchBar,
    });

    return (
      <div className="filter-row__advanced-select">
        <button
          className={classNames(
            'icon icon-filter filters-select',
            { 'filters-select_active': opened },
          )}
          onClick={this.handleIconClick}
          type="button"
        />
        <div className={className}>
          <div className={selectBlockClassName}>
            {
              withSearchBar
              && (
                <SelectSearchBox
                  query={query}
                  onChange={this.handleSearch}
                />
              )
            }
            <div className="select-block__container">
              {this.renderOptions()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(FiltersSelect);
