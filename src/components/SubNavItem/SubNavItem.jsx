import React, { Component } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'constants/propTypes';
import { withRouter } from 'react-router-dom';
import { NavLink } from 'components/Link';
import './SubNavItem.scss';

class SubNavItem extends Component {
  static propTypes = {
    ...PropTypes.router,
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  };

  render() {
    const {
      label,
      url,
    } = this.props;

    return (
      <NavLink className="sub-nav-item" activeClassName="sub-nav-item sub-nav-item--active" to={url}>
        <i className="icon-nav-arrow-v sub-nav-item__icon" />
        {I18n.t(label)}
      </NavLink>
    );
  }
}


export default withRouter(SubNavItem);
