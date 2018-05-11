import React from 'react';
import { Link, withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import { Nav, NavItem } from 'reactstrap';
import PropTypes from '../../constants/propTypes';
import './TabHeaderNav.scss';

const TabHeaderNav = ({ params: { id }, links }) => (
  <Nav className="col tab-header-nav">
    {links.map((item, index) => (
      <NavItem key={item.url}>
        {index > 0 && ' / '}
        <Link
          className="tab-header-nav__item"
          to={item.url.replace(/:id/, id)}
          activeClassName="tab-header-nav__item--active"
        >
          {I18n.t(item.label)}
        </Link>
      </NavItem>
    ))}
  </Nav>
);

TabHeaderNav.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
  links: PropTypes.arrayOf(PropTypes.subTabRouteEntity).isRequired,
};

export default withRouter(TabHeaderNav);
