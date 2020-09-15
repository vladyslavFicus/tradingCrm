import React from 'react';
import { NavLink as OriginalNavLink } from 'react-router-dom';
import Link from './Link';

class NavLink extends Link {
  render() {
    return <OriginalNavLink {...this.props} onClick={this.handleClick} />;
  }
}

export default NavLink;
