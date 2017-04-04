import React, { Component } from 'react';
import { Link } from 'react-router';
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
        {label}
      </Link>
    );
  }
}


export default SubNavItem;
