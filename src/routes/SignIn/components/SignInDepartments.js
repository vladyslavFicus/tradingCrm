import React, { Component } from 'react';
import classNames from 'classnames';
import SignInDepartmentItem from './SignInDepartmentItem';
import PropTypes from '../propTypes';
import Greeting from '../../../components/Greeting';

class SignInDepartments extends Component {
  state = { step: 0, departments: [] };

  componentWillReceiveProps(nextProps) {
    const { logged } = this.props;

    if (logged !== nextProps.logged) {
      if (nextProps.logged) {
        setTimeout(() => {
          this.setState({ step: 1, departments: nextProps.departments });
        }, 250);
      } else {
        setTimeout(() => {
          this.setState({ step: 0, departments: nextProps.departments });
        }, 370);
      }
    }
  }

  render() {
    const { step, departments } = this.state;
    const { onSelect, onBackClick, canGoBack, username, brand } = this.props;
    const className = classNames('sign-in__department', {
      fadeOutDown: step === 0,
      fadeInUp: step > 0,
      'sign-in__single-brand': !canGoBack,
    });

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
        {
          !canGoBack && brand &&
          <div className="sign-in__single-brand_brand">
            <div>
              <img src={brand.image} alt={brand.name} />
            </div>
            <div className="sign-in__single-brand_label">
              {brand.name}
            </div>
          </div>
        }
        <div className="sign-in__multibrand_call-to-action">
          {canGoBack ? 'And now, choose the department' : 'Please, choose  the department'}
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
  logged: PropTypes.bool.isRequired,
  departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  onSelect: PropTypes.func.isRequired,
  onBackClick: PropTypes.func.isRequired,
  canGoBack: PropTypes.bool,
  username: PropTypes.string,
  brand: PropTypes.brand,
};
SignInDepartments.defaultProps = {
  canGoBack: false,
  username: null,
  brand: null,
};

export default SignInDepartments;
