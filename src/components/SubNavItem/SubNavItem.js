import React, { Component } from 'react';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

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
      <Link className="dropdown-item" to={url} onClick={onMenuItemClick}>
        <i className="fa fa-chevron-right" />
        <span className="nav-sublink__label">{I18n.t(label)}</span>
      </Link>
    );
  }
}


export default SubNavItem;
