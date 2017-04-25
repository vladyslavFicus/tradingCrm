import React, { Component } from 'react';
import { Link } from 'react-router';
import { I18n } from 'react-redux-i18n';
import PropTypes from '../../constants/propTypes';

class SubNavItem extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  };

  render() {
    const {
      label,
      url,
    } = this.props;

    return (
      <Link className="dropdown-item" to={url}>
        {I18n.t(label)}
      </Link>
    );
  }
}


export default SubNavItem;
