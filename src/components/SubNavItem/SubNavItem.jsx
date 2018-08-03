import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import './SubNavItem.scss';

class SubNavItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onMenuItemClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      label,
      url,
      onMenuItemClick,
    } = this.props;

    return (
      <Link className="sub-nav-item" to={url} onClick={onMenuItemClick}>
        <i className="icon-nav-arrow-v sub-nav-item__icon" />
        {I18n.t(label)}
      </Link>
    );
  }
}


export default SubNavItem;
