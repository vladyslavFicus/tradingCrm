import React, { Component } from 'react';
import SubMenuItem from './SubMenuItem';

class SubMenu extends Component {
  render () {
    const {
      items,
    } = this.props;

    return (
      <div className="dropdown-menu">
        {items.map(item => (
          <SubMenuItem
            label={item.label}
            url={item.url}
          />
        ))}
      </div>
    );
  }
}

export default SubMenu;
