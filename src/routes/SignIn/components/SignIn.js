import React, { Component } from 'react';
import { IndexLink, withRouter } from 'react-router';
import { SubmissionError } from 'redux-form';
import classNames from 'classnames';
import SignInForm from './SignInForm';
import './SignInBase.scss';
import './SignIn.scss';
import SignInBrands from './SignInBrands';
import SignInDepartments from './SignInDepartments';
import Preloader from './Preloader';
import PropTypes from '../propTypes';

class SignIn extends Component {
  static propTypes = {
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        returnUrl: PropTypes.string,
      }),
    }).isRequired,
    signIn: PropTypes.func.isRequired,
    selectBrand: PropTypes.func.isRequired,
    selectDepartment: PropTypes.func.isRequired,
    brand: PropTypes.brand,
    department: PropTypes.department,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  };
  static defaultProps = {
    brand: null,
    department: null,
  };

  state = {
    step: 0,
  };

  componentWillMount() {
    document.body.classList.add('sign-in-page');

    setTimeout(() => {
      this.setState({ step: 1 });
    }, 1000);
  }

  componentWillUnmount() {
    document.body.classList.remove('sign-in-page');
  }

  componentWillReceiveProps(nextProps) {
    const { brand, brands } = this.props;

    if (brands.length !== nextProps.brands.length) {
      this.setState({ step: 2 }, () => {
        setTimeout(() => {
          this.setState({ step: 3 });
        }, 500);
      });
    }

    if (brand !== nextProps.brand) {
      this.setState({ step: 4 });
    }
  }

  handleSubmit = (data) => {
    this.props.signIn(data);
  };

  handleSelectBrand = (brand) => {
    this.props.selectBrand(brand);
  };

  handleSelectDepartment = (department) => {
    this.props.selectDepartment(department);
  };

  render() {
    const { step } = this.state;
    const {
      brand,
      brands,
      department,
      departments,
      data: { login },
    } = this.props;

    return (
      <div>
        <Preloader show={step === 0} />
        <div className="wrapper">
          <div className="sign-in">
            <div className="sign-in__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <div className={classNames('sign-in__form', {
              fadeInUp: step > 0, // step 1
              fadeOutLeft: step > 1, // step 2
              'position-absolute': step > 2, // step 3
            })}
            >
              <SignInForm onSubmit={this.handleSubmit} />
            </div>

            <SignInBrands
              className={classNames('sign-in__multibrand', {
                fadeInUp: step > 2,
              })}
              username={login}
              brands={brands}
              onSelect={this.handleSelectBrand}
            />

            <SignInDepartments
              className={classNames('sign-in__department', {
                fadeInUp: step === 4,
              })}
              departments={departments}
              onSelect={this.handleSelectDepartment}
              onBackClick={() => this.handleSelectBrand(null)}
            />
          </div>
        </div>

        <div className="sign-in__copyright">Copyright © 2017 by Newage</div>
      </div>
    );
  }
}

export default SignIn;

