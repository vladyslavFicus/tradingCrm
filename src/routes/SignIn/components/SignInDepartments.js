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
        this.activeTimeout = setTimeout(() => {
          this.setState({ step: 1, departments: nextProps.departments });
        }, 250);
      } else {
        this.activeTimeout = setTimeout(() => {
          this.setState({ step: 0 }, () => {
            this.activeTimeout = setTimeout(() => {
              this.setState({ departments: nextProps.departments });
            }, 200);
          });
        }, 370);
      }
    }
  }

  componentWillUnmount() {
    if (this.activeTimeout !== null) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }
  }

  activeTimeout = null;

  render() {
    const { step, departments } = this.state;
    const { onSelect, onBackClick, canGoBack, username, brand } = this.props;
    const className = classNames('form-page__department', {
      fadeOutDown: step === 0,
      fadeInUp: step > 0,
      'form-page__single-brand': !canGoBack,
    });

    return (
      <div className={className}>
        {
          !canGoBack && username
            ? <div className="form-page__multibrand_heading"><Greeting username={username} /></div>
            : (
              <div className="form-page__department_return" onClick={onBackClick}>
                All <span className="return-label">brands</span>
              </div>
            )
        }
        {
          !canGoBack && brand &&
          <div className="form-page__single-brand_brand">
            <div>
              <img alt={brand.name} id={brand.id} {...brand.image} />
            </div>
            <div className="form-page__single-brand_label">
              {brand.name}
            </div>
          </div>
        }
        <div className="form-page__multibrand_call-to-action">
          {canGoBack ? 'And now, choose the department' : 'Please, choose  the department'}
        </div>
        <div className="form-page__department_block">
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
