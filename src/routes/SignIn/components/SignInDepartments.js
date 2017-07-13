import React, { Component } from 'react';
import SignInDepartmentItem from './SignInDepartmentItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';
import shallowEqual from '../../../utils/shallowEqual';

class SignInDepartments extends Component {
  state = { departments: [] };

  componentWillReceiveProps(nextProps) {
    const { departments } = this.props;

    if (!shallowEqual(departments, nextProps.departments)) {
      this.setState({ departments: nextProps.departments });
    }
  }

  render() {
    const { departments } = this.state;
    const { className, onSelect, onBackClick, canGoBack, username } = this.props;

    return (
      <div className={className}>
        {
          !canGoBack && username
            ? <div className="sign-in__multibrand_heading"><Greeting username={username} /></div>
            : (
              <div className="sign-in__department_return" onClick={onBackClick}>
                All <span className="return-label">brands</span>
              </div>
            )
        }
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
  }
}

SignInDepartments.propTypes = {
  className: PropTypes.string,
  departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  onSelect: PropTypes.func.isRequired,
  onBackClick: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool,
  username: PropTypes.string,
};
SignInDepartments.defaultProps = {
  className: 'sign-in__department',
  canGoBack: false,
  username: null,
};

export default SignInDepartments;
