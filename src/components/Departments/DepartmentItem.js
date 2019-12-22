import React from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';

const DepartmentItem = ({ name, role, image, onClick, id }) => (
  <div className="departments__item" onClick={onClick}>
    <img
      id={id}
      src={image}
      className="departments__item-image"
      alt={`${I18n.t(name)} / ${I18n.t(role)}`}
    />

    <div className="departments__item-head">
      <div className="departments__item-title">{I18n.t(name)}</div>
      <div className="departments__item-role">{I18n.t(role)}</div>
    </div>
  </div>
);

DepartmentItem.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  id: PropTypes.string,
};

DepartmentItem.defaultProps = {
  id: '',
};

export default DepartmentItem;
