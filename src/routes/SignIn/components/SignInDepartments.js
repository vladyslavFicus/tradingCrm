import React from 'react';
import SignInDepartmentItem from './SignInDepartmentItem';
import PropTypes from '../propTypes';

const SignInDepartments = ({ className, departments, onSelect, onBackClick }) => (
  <div className={className}>
    <div className="sign-in__department_return" onClick={onBackClick}>
      All <span className="return-label">brands</span>
    </div>
    <div className="sign-in__multibrand_call-to-action">
      And now, choose the department
    </div>
    <div className="sign-in__department_block">
      {departments.map(department => (
        <SignInDepartmentItem key={department.name} {...department} onClick={() => onSelect(department)} />
      ))}
    </div>
  </div>
);
SignInDepartments.propTypes = {
  className: PropTypes.string,
  departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  onSelect: PropTypes.func.isRequired,
  onBackClick: PropTypes.func.isRequired,
};
SignInDepartments.defaultProps = {
  className: 'sign-in__department',
};

export default SignInDepartments;
