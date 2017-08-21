import React, { Component } from 'react';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

class SubNavItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    onMenuClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      label,
      url,
      onMenuClick,
    } = this.props;

    return (
      <Link className="dropdown-item" to={url} onClick={onMenuClick}>
        {I18n.t(label)}
      </Link>
    );
  }
}


export default SubNavItem;
