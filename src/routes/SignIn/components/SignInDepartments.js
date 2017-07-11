import React from 'react';
import SignInDepartmentItem from './SignInDepartmentItem';

const SignInDepartments = ({ departments, onSelect, onBackClick }) => (
  <div className="sign-in__department">
    <div className="sign-in__department_return" onClick={onBackClick}>
      All <span className="return-label">brands</span>
    </div>
    <div className="sign-in__multibrand_call-to-action">
      And now, choose the department
    </div>
    <div className="sign-in__department_block">
      {departments.map(department => (
        <SignInDepartmentItem
          name=""
          role=""
          image=""
          onClick={() => onSelect(department)}
        />
      ))}
    </div>
  </div>
);

export default SignInDepartments;
