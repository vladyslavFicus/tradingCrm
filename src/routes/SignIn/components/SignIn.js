import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import PropTypes from '../../../constants/propTypes';
import SignInForm from './SignInForm';
import Preloader from '../../../components/Preloader';
import { Brands, Departments } from '../../../components/Brands';
import Copyrights from '../../../components/Copyrights';

class SignIn extends Component {
  static propTypes = {
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        returnUrl: PropTypes.string,
        spec: PropTypes.string,
      }),
    }).isRequired,
    signIn: PropTypes.func.isRequired,
    selectBrand: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    changeDepartment: PropTypes.func.isRequired,
    setDepartmentsByBrand: PropTypes.func.isRequired,
    fetchProfile: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    brand: PropTypes.brand,
    logged: PropTypes.bool.isRequired,
    fullName: PropTypes.string,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    departments: PropTypes.arrayOf(PropTypes.department).isRequired,
    data: PropTypes.shape({
      uuid: PropTypes.string,
      token: PropTypes.string,
      departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
    }).isRequired,
  };
  static defaultProps = {
    brand: null,
    fullName: null,
  };

  state = {
    loading: true,
    logged: false,
  };

  componentDidMount() {
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
    if (this.resetStateTimeout) {
      clearTimeout(this.resetStateTimeout);

      this.resetStateTimeout = null;
    }

    this.props.reset();
  }

  resetStateTimeout = null;

  handleSubmit = async (data) => {
    const { signIn } = this.props;
    const action = await signIn(data);

    if (action) {
      if (!action.error) {
        console.info('Sign in successful');

        this.setState({ logged: true }, () => {
          const { departmentsByBrand, token, uuid } = action.payload;
          const brands = Object.keys(departmentsByBrand);
          console.info(`Logged with ${brands.length} brands`);

          if (brands.length === 1) {
            const departments = Object.keys(departmentsByBrand[brands[0]]);

            if (departments.length === 1) {
              return this.handleSelectDepartment(brands[0], departments[0], token, uuid);
            }
          }
        });
      } else {
        const error = action.payload.response.error ? action.payload.response.error : action.payload.message;
        console.info(`Sign in failure, reason: ${error}`);

        throw new SubmissionError({ _error: error });
      }
    }

    return action;
  };

  handleSelectBrand = (brand) => {
    if (brand) {
      const { data: { departmentsByBrand, token, uuid } } = this.props;
      const departments = Object.keys(departmentsByBrand[brand.brand]);

      if (departments.length === 1) {
        return this.handleSelectDepartment(brand.brand, departments[0], token, uuid);
      }
    }

    return this.props.selectBrand(brand);
  };

  handleSelectDepartment = async (brand, department, requestToken = null, requestUuid = null) => {
    const {
      changeDepartment,
      data: { token: dataToken, uuid: dataUuid, departmentsByBrand },
      setDepartmentsByBrand,
      fetchAuthorities,
      fetchProfile,
      reset,
    } = this.props;
    const token = requestToken || dataToken;
    const uuid = requestUuid || dataUuid;

    this.setState({ loading: true, logged: false }, async () => {
      const action = await changeDepartment(department, brand, token);

      if (action && !action.error) {
        setDepartmentsByBrand(departmentsByBrand);
      }

      this.resetStateTimeout = setTimeout(() => this.setState({ loading: false }, () => {
        reset();
      }), 2000);

      if (action) {
        if (!action.error) {
          await Promise.all([
            fetchProfile(uuid, action.payload.token),
            fetchAuthorities(uuid, action.payload.token),
          ]);

          this.redirectToNextPage();
        } else {
          throw new SubmissionError({ _error: action.payload.response.error || action.payload.message });
        }
      }
    });
  };

  redirectToNextPage = () => {
    const { location, router } = this.props;
    let nextUrl = '/';

    if (
      location.query && location.query.returnUrl
      && !/sign\-in/.test(location.query.returnUrl)
      && !/logout/.test(location.query.returnUrl)
      && !/brands/.test(location.query.returnUrl)
    ) {
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
      selectBrand,
    } = this.props;

    return (
      <div className="form-page-container">
        <Preloader show={loading} />
        <div className="wrapper">
          <div className="form-page">
            <div className="form-page__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <SignInForm
              logged={logged}
              onSubmit={this.handleSubmit}
            />

            <Brands
              logged={logged}
              activeBrand={brand}
              username={fullName}
              brands={brands}
              onSelect={this.handleSelectBrand}
            />

            <Departments
              logged={logged && !!brand}
              brand={brand}
              canGoBack={brands.length > 1}
              username={fullName}
              departments={departments}
              onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
              onBackClick={() => selectBrand(null)}
            />
          </div>
        </div>

        <Copyrights />
      </div>
    );
  }
}

export default SignIn;
