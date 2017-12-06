import React, { Component } from 'react';
import classNames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import './FiltersSelect.scss';
import SelectSingleOptions from '../../Select/SelectSingleOptions';

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

    return (
      <div>
        <button
          className={classNames('filters-select', { 'filters-select_active': opened })}
          onClick={this.handleIconClick}
          type="button"
        >
          <i className="nas nas-add_filter_icon" />
        </button>
        {
          opened &&
          <SelectSingleOptions
            onChange={this.handleChange}
            options={options.map(option => ({ key: option.uuid, label: option.label, value: option.uuid }))}
          />
        }
      </div>
    );
  }
}

export default onClickOutside(FiltersSelect);
