import React from 'react';
import PropTypes from 'prop-types';

const SignInDepartmentItem = ({ name, role, image, onClick }) => (
  <div className="department-item" onClick={onClick}>
    <div>
      <img src={image} alt={`${name} / ${role}`} />
    </div>
    <div className="department-item_details">
      <div className="department-name">
        {name}
      </div>
      <div className="department-role">
        {role}
      </div>
    </div>
  </div>
);
SignInDepartmentItem.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SignInDepartmentItem;
