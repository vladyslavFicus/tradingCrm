import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-redux-i18n';

const DepartmentItem = ({ name, role, image, onClick, id }) => (
  <div className="department-item" onClick={onClick}>
    <div>
      <img src={image} alt={`${I18n.t(name)} / ${I18n.t(role)}`} id={id} />
    </div>
    <div className="department-item_details">
      <div className="department-name">
        {I18n.t(name)}
      </div>
      <div className="department-role">
        {I18n.t(role)}
      </div>
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
