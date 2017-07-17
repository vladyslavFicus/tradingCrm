import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
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
    logged: PropTypes.bool.isRequired,
    fullName: PropTypes.string,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
  };
  static defaultProps = {
    brand: null,
    fullName: null,
  };

  state = {
    loading: true,
    logged: false,
  };

  componentWillMount() {
    setTimeout(() => {
      this.setState({ loading: false });
    }, 300);
  }

  componentWillReceiveProps(nextProps) {
    const { logged } = this.props;

    if (logged !== nextProps.logged) {
      this.setState({ logged: nextProps.logged });
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
        this.setState({ logged: true }, () => {
          const { departmentsByBrand, token, uuid } = action.payload;
          const brands = Object.keys(departmentsByBrand);


          if (brands.length === 1) {
            const departments = Object.keys(departmentsByBrand[brands[0]]);

            if (departments.length === 1) {
              this.handleSelectDepartment(brands[0], departments[0], token, uuid);
            }
          }
        });
      } else {
        const error = action.payload.response.error ?
          action.payload.response.error : action.payload.message;
        throw new SubmissionError({ _error: error });
      }
    }

    return action;
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

    this.setState({ loading: true }, async () => {
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
    });

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
    const { loading, logged } = this.state;
    const {
      brand,
      brands,
      departments,
      fullName,
    } = this.props;

    return (
      <div className="sign-in-page" style={{ height: '100%' }}>
        <Preloader show={loading} />
        <div className="wrapper">
          <div className="sign-in">
            <div className="sign-in__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <SignInForm
              logged={logged}
              onSubmit={this.handleSubmit}
            />

            <SignInBrands
              logged={logged}
              activeBrand={brand}
              username={fullName}
              brands={brands}
              onSelect={this.props.selectBrand}
            />

            <SignInDepartments
              logged={logged && !!brand}
              brand={brand}
              canGoBack={brands.length > 1}
              username={fullName}
              departments={departments}
              onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
              onBackClick={() => this.props.selectBrand(null)}
            />
          </div>
        </div>

        <div className="sign-in__copyright">Copyright © {(new Date()).getFullYear()} by Newage</div>
      </div>
    );
  }
}

export default SignIn;

