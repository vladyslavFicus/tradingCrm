import React from 'react';
import { NavLink as OriginalNavLink } from 'react-router-dom';
import Link from './Link';

type Props = {
  to: string,
  children: React.ReactNode,
  className: string,
  activeClassName: string,
};

class NavLink extends Link<Props> {
  render() {
    return <OriginalNavLink {...this.props} onClick={this.handleClick} />;
  }
}

export default NavLink;
