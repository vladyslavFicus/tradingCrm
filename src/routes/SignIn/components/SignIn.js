import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import classNames from 'classnames';
import SignInForm from './SignInForm';
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
    reset: PropTypes.func.isRequired,
    changeDepartment: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    brand: PropTypes.brand,
    fullName: PropTypes.string,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  };
  static defaultProps = {
    brand: null,
    fullName: null,
  };

  state = {
    step: 0,
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({ step: 1 });
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const { brand, brands } = this.props;
    const nextState = {};
    let nextStateCallback;

    if (brands.length !== nextProps.brands.length) {
      nextState.step = 2;
      nextStateCallback = () => {
        setTimeout(() => {
          this.setState({ step: 3 });
        }, 500);
      };
    }

    if (brand !== nextProps.brand) {
      if (nextProps.brand) {
        requestAnimationFrame(() => {
          this.setState({ step: 4 });
        });
        delete nextState.step;
        nextStateCallback = undefined;
      } else {
        nextState.step = 3;
        nextStateCallback = undefined;
      }
    }

    if (Object.keys(nextState).length > 0) {
      this.setState(nextState, nextStateCallback);
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  handleSubmit = async (data) => {
    const { signIn } = this.props;
    const action = await signIn(data);

    if (action) {
      if (!action.error) {
        const { departmentsByBrand, token, uuid } = action.payload;
        const brands = Object.keys(departmentsByBrand);


        if (brands.length === 1) {
          const departments = Object.keys(departmentsByBrand[brands[0]]);

          if (departments.length === 1) {
            return this.handleSelectDepartment(brands[0], departments[0], token, uuid);
          }
        }
      } else {
        const error = action.payload.response.error ?
          action.payload.response.error : action.payload.message;
        throw new SubmissionError({ _error: error });
      }
    }

    return action;
  };

  handleSelectBrand = (brand) => {
    this.props.selectBrand(brand);
  };

  handleSelectDepartment = async (brand, department, requestToken = null, requestUuid = null) => {
    const {
      changeDepartment,
      data: { token: dataToken, uuid: dataUuid },
      fetchAuthorities,
      fetchProfile,
    } = this.props;
    const token = requestToken || dataToken;
    const uuid = requestUuid || dataUuid;
    const action = await changeDepartment(department, brand, token);

    if (action) {
      if (!action.error) {
        await Promise.all([
          fetchProfile(uuid, action.payload.token),
          fetchAuthorities(uuid, action.payload.token),
        ]);

        this.redirectToNextPage();
      } else {
        const error = action.payload.response.error ?
          action.payload.response.error : action.payload.message;
        throw new SubmissionError({ _error: error });
      }
    }
  };

  redirectToNextPage = () => {
    const { location, router } = this.props;
    let nextUrl = '/';

    if (location.query && location.query.returnUrl && !/sign\-in/.test(location.query.returnUrl)) {
      nextUrl = location.query.returnUrl;
    }

    router.replace(nextUrl);
  };

  render() {
    const { step } = this.state;
    const {
      brand,
      brands,
      departments,
      fullName,
    } = this.props;

    return (
      <div className="sign-in-page" style={{ height: '100%' }}>
        <Preloader show={step === 0} />
        <div className="wrapper">
          <div className="sign-in">
            <div className="sign-in__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <SignInForm
              className={classNames('sign-in__form', {
                fadeInUp: step > 0, // step 1
                fadeOutLeft: step > 1, // step 2
                'position-absolute': step > 2, // step 3
              })}
              onSubmit={this.handleSubmit}
            />

            <SignInBrands
              activeBrand={brand}
              className={classNames('sign-in__multibrand', {
                fadeInUp: step > 2,
              })}
              username={fullName}
              brands={brands}
              onSelect={this.handleSelectBrand}
            />

            <SignInDepartments
              canGoBack={brands.length > 1}
              className={classNames('sign-in__department', {
                fadeOutDown: step < 4,
                fadeInUp: step > 3,
              })}
              username={fullName}
              departments={departments}
              onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
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

