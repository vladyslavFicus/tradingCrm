import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import './DepartmentItem.scss';

class DepartmentItem extends PureComponent {
  static propTypes = {
    department: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { onClick } = this.props;
    const { department, role } = this.props.department || {};

    return (
      <div className="DepartmentItem" onClick={onClick}>
        <img
          src={`/img/departments/${department}.svg`}
          onError={(e) => { e.target.src = '/img/image-placeholder.svg'; }}
          className="DepartmentItem__image"
          alt={`${department} / ${role}`}
        />

        <div className="DepartmentItem__head">
          <div className="DepartmentItem__title">
            {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`, { defaultValue: department })}
          </div>
          <div className="DepartmentItem__role">
            {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
          </div>
        </div>
      </div>
    );
  }
}

export default DepartmentItem;
