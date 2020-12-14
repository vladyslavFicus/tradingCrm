import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ReactComponent as SwitcherIcon } from './icons/switcher.svg';

class FilterSetsToggler extends PureComponent {
  static propTypes = {
    children: PropTypes.func.isRequired,
  };

  state = {
    filtersVisible: true,
  };

  toggleVisibility = () => (
    this.setState(({ filtersVisible }) => ({
      filtersVisible: !filtersVisible,
    }))
  );

  renderTrigger = () => (
    <div
      className={classNames('filter-switcher', { 'is-closed': !this.state.filtersVisible })}
      onClick={this.toggleVisibility}
    >
      <SwitcherIcon />
    </div>
  );

  render() {
    const { filtersVisible } = this.state;

    return this.props.children({ filtersVisible, renderTrigger: this.renderTrigger });
  }
}

export default FilterSetsToggler;
