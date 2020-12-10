import React, { PureComponent } from 'react';
import PropTypes from 'constants/propTypes';
import SubNavItem from '../SubNavItem';
import './SubNav.scss';

class SubNav extends PureComponent {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.navSubItem).isRequired,
  };

  render() {
    const { items } = this.props;

    return (
      <div className="SubNav">
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

export default SubNav;
