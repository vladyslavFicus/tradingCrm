import React, { Component } from 'react';
import classNames from 'classnames';
import SubMenu from './SubMenu';

class MenuItem extends Component {
  state = {
    opened: false,
  }

  handleDropDownClick = () => {
    this.setState({opened: !this.state.opened});
  }

  render () {
    const {
      label,
      icon,
      url,
      items,
    } = this.props;

    const {opened} = this.state;

    if (items && items.length > 0) {
      return (
        <li className={classNames('nav-item dropdown', {active: opened})} onClick={this.handleDropDownClick}>
          <a className="nav-link dropdown-toggle" href="#">
            <i className={icon} />
            <span className="link-text">
              {label}<i className="fa fa-angle-down" />
            </span>
          </a>
          <SubMenu
            items={items}
            opened
          />
        </li>
      );
    }

    return (
      <li className="nav-item">
        <a className="nav-link" href={url}>
          <i className={icon} />
          <span className="link-text">
              {label}
          </span>
        </a>
      </li>
    );
  }
}

export default MenuItem;
