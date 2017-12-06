import React, { Component } from 'react';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import './FiltersSelect.scss';
import SelectSingleOptions from '../../Select/SelectSingleOptions';
import SelectSearchBox from '../../Select/SelectSearchBox';

class FiltersSelect extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      label: PropTypes.string,
    })).isRequired,
  };

  state = {
    opened: false,
  };

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
    const { opened } = this.state;
    const { options } = this.props;

    const className = classNames('select-block', {
      'is-opened': opened,
    });

    const selectBlockClassName = classNames('select-block__content', {
      'with-search-bar': options.length > 5,
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
              options.length > 5 &&
              <SelectSearchBox
                query=""
                onChange={() => {}}
              />
            }
            <div className="select-block__container">
              <SelectSingleOptions
                onChange={this.handleChange}
                options={options.map(option => ({ key: option.uuid, label: option.label, value: option.uuid }))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default onClickOutside(FiltersSelect);
