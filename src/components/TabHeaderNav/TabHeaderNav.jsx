import React from 'react';
import { NavLink } from 'react-router-dom';
import I18n from 'i18n-js';
import { Nav, NavItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import './TabHeaderNav.scss';

const TabHeaderNav = ({ links }) => (
  <Nav className="col tab-header-nav">
    {links.map((item, index) => (
      <NavItem key={item.url}>
        {index > 0 && ' / '}
        <NavLink
          className="tab-header-nav__item"
          to={item.url}
          activeClassName="tab-header-nav__item--active"
        >
          {I18n.t(item.label)}
        </NavLink>
      </NavItem>
    ))}
  </Nav>
);

TabHeaderNav.propTypes = {
  links: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
};

export default TabHeaderNav;
