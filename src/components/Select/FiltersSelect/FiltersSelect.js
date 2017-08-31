import React, { Component } from 'react';
import classNames from 'classnames';

class FiltersSelect extends Component {
  state = {
    active: false,
  };

  handleActive = () => {
    this.setState({ active: !this.state.active });
  };

  render() {
    const { active } = this.state;

    return (
      <button
        className={classNames('btn btn-default-outline btn-icon', { 'btn-icon_active': active })}
        onClick={this.handleActive}
      >
        <i className="nas nas-add_filter_icon" />
      </button>
    );
  }
}

export default FiltersSelect;
