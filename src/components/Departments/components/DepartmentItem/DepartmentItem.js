import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import './DepartmentItem.scss';

class DepartmentItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const {
      name,
      role,
      image,
      onClick,
    } = this.props;

    return (
      <div className="DepartmentItem" onClick={onClick}>
        <img
          src={image}
          className="DepartmentItem__image"
          alt={`${I18n.t(name)} / ${I18n.t(role)}`}
        />

        <div className="DepartmentItem__head">
          <div className="DepartmentItem__title">{I18n.t(name)}</div>
          <div className="DepartmentItem__role">{I18n.t(role)}</div>
        </div>
      </div>
    );
  }
}

export default DepartmentItem;
