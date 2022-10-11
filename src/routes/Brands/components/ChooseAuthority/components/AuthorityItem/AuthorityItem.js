import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import './AuthorityItem.scss';

class AuthorityItem extends PureComponent {
  static propTypes = {
    authority: PropTypes.shape({
      department: PropTypes.string,
      role: PropTypes.string,
      image: PropTypes.string,
    }).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  render() {
    const { onClick } = this.props;
    const { department, role } = this.props.authority || {};

    return (
      <div className="AuthorityItem" onClick={onClick}>
        <img
          src={`/img/departments/${department}.svg`}
          onError={(e) => { e.target.src = '/img/image-placeholder.svg'; }}
          className="AuthorityItem__image"
          alt={`${department} / ${role}`}
        />

        <div className="AuthorityItem__head">
          <div className="AuthorityItem__title">
            {I18n.t(`CONSTANTS.OPERATORS.DEPARTMENTS.${department}`, { defaultValue: department })}
          </div>
          <div className="AuthorityItem__role">
            {I18n.t(`CONSTANTS.OPERATORS.ROLES.${role}`, { defaultValue: role })}
          </div>
        </div>
      </div>
    );
  }
}

export default AuthorityItem;
