import React, { Component } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import SubNav from '../SubNav';
import PropTypes from '../../constants/propTypes';

class NavItem extends Component {
  static propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string.isRequired,
    url: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.navItem),
  };

  state = {
    opened: false,
  };

  handleDropDownClick = () => {
    this.setState({ opened: !this.state.opened });
  };

  render() {
    const {
      label,
      icon,
      url,
      items,
    } = this.props;
    const className = classNames('nav-item dropdown', { active: this.state.opened });

    if (items && items.length > 0) {
      return (
        <li className={className} onClick={this.handleDropDownClick}>
          <a className="nav-link dropdown-toggle" href="#">
            {!!icon && <i className={icon} />}
            <span className="link-text">
              {label}
              <i className="fa fa-angle-down" />
            </span>
          </a>
          <SubNav
            items={items}
            opened
          />
        </li>
      );
    }

    return (
      <li className="nav-item">
        <Link className="nav-link" to={url}>
          {!!icon && <i className={icon} />}
          <span className="link-text">
            {label}
          </span>
        </Link>
      </li>
    );
  }
}

export default NavItem;
