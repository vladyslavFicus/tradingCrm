import React, { Component } from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import history from 'router/history';
import './SubNavItem.scss';

class SubNavItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  };

  /**
   * Handle menu item click for prevent animation freezing
   * @param url
   */
  handleMenuItemClick = (url) => {
    this.props.onMenuItemClick();

    setTimeout(() => history.push(url), 300);
  };

  render() {
    const {
      label,
      url,
    } = this.props;

    return (
      <div className="sub-nav-item" to={url} onClick={() => this.handleMenuItemClick(url)}>
        <i className="icon-nav-arrow-v sub-nav-item__icon" />
        {I18n.t(label)}
      </div>
    );
  }
}


export default SubNavItem;
