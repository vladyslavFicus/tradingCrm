import React, { Component } from 'react';
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
      <span className="dropdown-item" onClick={() => onMenuClick(url)}>
        {I18n.t(label)}
      </span>
    );
  }
}


export default SubNavItem;
