import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import formatLabel from 'utils/formatLabel';
import './DepartmentItem.scss';

class DepartmentItem extends PureComponent {
  static propTypes = {
    department: PropTypes.shape({
      name: PropTypes.string,
      role: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { department, onClick } = this.props;
    const { name, role, image } = department || {};

    return (
      <div className="DepartmentItem" onClick={onClick}>
        <img
          src={image}
          className="DepartmentItem__image"
          alt={`${I18n.t(name)} / ${I18n.t(role)}`}
        />

        <div className="DepartmentItem__head">
          <div className="DepartmentItem__title">{I18n.t(name)}</div>
          <div className="DepartmentItem__role">{formatLabel(role)}</div>
        </div>
      </div>
    );
  }
}

export default DepartmentItem;
