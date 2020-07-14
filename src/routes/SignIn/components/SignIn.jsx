import React, { Component } from 'react';
import { parseErrors } from 'apollo';
import { getBackofficeBrand } from 'config';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import Preloader from 'components/Preloader';
import Brands from 'components/Brands';
import Departments from 'components/Departments';
import Copyrights from 'components/Copyrights';
import { mapBrands, mapDepartments } from 'utils/brands';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import SignInForm from './SignInForm';

class SignIn extends Component {
  static propTypes = {
    signInMutation: PropTypes.func.isRequired,
    chooseDepartmentMutation: PropTypes.func.isRequired,
    ...withStorage.propTypes,
  };

  state = {
    brandToAuthorities: {},
    signInFormError: '',
    departments: [],
    loading: false,
    brands: [],
    brand: null,
    step: 1,
  };

  componentDidUpdate() {
    const {
      step,
      brand,
      brands,
      loading,
      departments,
    } = this.state;

    if (step === 2 && brands.length === 1) {
      return this.handleSelectBrand(brands[0]);
    }

    if (step === 3 && departments.length === 1) {
      return this.handleSelectDepartment(brand.brand, departments[0]);
    }

    return loading === true ? this.removePreloader() : null;
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSubmit = async (values) => {
    const { signInMutation, storage } = this.props;

    try {
      const { data: { auth: { signIn: data } } } = await signInMutation({ variables: { ...values } });

      const { brandToAuthorities, token } = data;

      const brands = mapBrands(Object.keys(brandToAuthorities));

      this.setState({
        signInFormError: '',
        brandToAuthorities,
        step: 2,
        brands,
      }, () => {
        storage.set('token', token);
        storage.set('brands', brands);
        storage.set('brandToAuthorities', brandToAuthorities);
      });

      return null;
    } catch (e) {
      this.setState({ signInFormError: parseErrors(e).message });
      return null;
    }
  };

  handleSelectBrand = (brand) => {
    if (brand) {
      const { storage } = this.props;
      const { brandToAuthorities } = this.state;

      const brandDepartments = brandToAuthorities[brand.brand];
      const departments = brandDepartments.map(brandDepartment => mapDepartments(brandDepartment));

      this.setState({
        loading: true,
        departments,
        step: 3,
        brand,
      }, () => {
        storage.set('departments', departments);
      });
    }
  };

  handleSelectDepartment = async (brand, { department, role }) => {
    const { chooseDepartmentMutation, storage } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartmentMutation({
        variables: {
          brand,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', {
        department,
        role,
        uuid,
      });

      // This function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();
    } catch (e) {
      // Do nothing...
    }
  };

  handleOnBackClick = () => {
    this.setState({ step: 2 });
  };

  renderSignIn = () => {
    const {
      signInFormError,
      departments,
      brands,
      brand,
      step,
    } = this.state;

    switch (step) {
      case 1:
        return (
          <SignInForm
            onSubmit={this.handleSubmit}
            formError={signInFormError}
            setState={this.setState}
          />
        );
      case 2:
        return (
          <Brands
            brands={brands}
            onSelect={this.handleSelectBrand}
          />
        );
      case 3: {
        return (
          <Departments
            brand={brand}
            brands={brands}
            departments={departments}
            onSelect={department => this.handleSelectDepartment(brand.brand, department)}
            handleOnBackClick={this.handleOnBackClick}
          />
        );
      }
      default:
        return null;
    }
  };

  render() {
    const { loading } = this.state;

    return (
      <div className="auth">
        <Preloader isVisible={loading} />
        <div className="auth__logo">
          <If condition={getBackofficeBrand().themeConfig.logo}>
            <img src={getBackofficeBrand().themeConfig.logo} alt="logo" />
          </If>
        </div>
        <div className="auth__page">{this.renderSignIn()}</div>
        <Copyrights />
      </div>
    );
  }
}

export default withStorage(SignIn);
