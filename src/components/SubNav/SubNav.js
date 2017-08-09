import React, { Component } from 'react';
import classNames from 'classnames';
import SubNavItem from '../SubNavItem';
import PropTypes from '../../constants/propTypes';

class SubNav extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
    onMenuClick: PropTypes.func.isRequired,
    isAddDelay: PropTypes.bool.isRequired,
  };

  render() {
    const { items, onMenuClick, isAddDelay } = this.props;

    return (
      <div className={classNames('dropdown-menu', { addDelay: isAddDelay })}>
        {items.map((item, index) => (
          <SubNavItem
            key={index}
            label={item.label}
            url={item.url}
            onMenuClick={onMenuClick}
          />
        ))}
      </div>
    );
  }
}

export default SubNav;
