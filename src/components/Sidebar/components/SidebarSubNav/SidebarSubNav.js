import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import SubNavItem from '../SubNavItem';
import './SidebarSubNav.scss';

class SidebarSubNav extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
  };

  render() {
    const { items } = this.props;

    return (
      <div className="SidebarSubNav">
        {items.map(item => (
          <SubNavItem
            key={item.label}
            label={item.label}
            url={item.url}
          />
        ))}
      </div>
    );
  }
}

export default SidebarSubNav;
