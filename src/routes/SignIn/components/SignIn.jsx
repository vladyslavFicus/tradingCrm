import React, { Component } from 'react';
import { withStorage } from 'providers/StorageProvider';
import { getBackofficeBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Preloader from 'components/Preloader';
import Brands from 'components/Brands';
import Departments from 'components/Departments';
import Copyrights from 'components/Copyrights';
import { mapBrands, mapDepartments } from 'utils/brands';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import parseErrors from 'utils/parseErrors';
import SignInForm from './SignInForm';

class SignIn extends Component {
  static propTypes = {
    signInMutation: PropTypes.func.isRequired,
    chooseDepartmentMutation: PropTypes.func.isRequired,
    ...withStorage.propTypes,
  };

  state = {
    departmentsByBrand: {},
    signInFormError: '',
    departments: [],
    loading: false,
    brands: [],
    brand: null,
    uuid: null,
    step: 1,
  };

  componentDidUpdate() {
    const { step, brand, brands, departments, loading } = this.state;

    if (step === 2 && brands.length === 1) {
      return this.handleSelectBrand(brands[0]);
    }

    if (step === 3 && departments.length === 1) {
      return this.handleSelectDepartment(brand.brand, departments[0].id);
    }

    return loading === true ? this.removePreloader() : null;
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSubmit = async (data) => {
    try {
      const {
        data: {
          authorization: {
            signIn: {
              data: {
                departmentsByBrand,
                token,
                uuid,
              },
            },
          },
        },
      } = await this.props.signInMutation({ variables: { ...data } });

      const brands = mapBrands(Object.keys(departmentsByBrand));

      this.setState({
        signInFormError: '',
        departmentsByBrand,
        step: 2,
        brands,
        uuid,
      }, () => {
        this.props.storage.set('token', token);
        this.props.storage.set('brands', brands);
        this.props.storage.set('departmentsByBrand', departmentsByBrand);
      });

      return null;
    } catch (e) {
      this.setState({ signInFormError: parseErrors(e).message });
      return null;
    }
  };

  handleSelectBrand = (brand) => {
    if (brand) {
      const { departmentsByBrand } = this.state;

      const brandDepartments = departmentsByBrand[brand.brand];
      const departments = Object.keys(brandDepartments).map(mapDepartments(brandDepartments));

      this.setState({
        loading: true,
        departments,
        step: 3,
        brand,
      }, () => {
        this.props.storage.set('departments', departments);
      });
    }
  };

  handleSelectDepartment = async (brand, department) => {
    const { departmentsByBrand } = this.state;

    const {
      data: {
        authorization: {
          chooseDepartment: {
            data: {
              token,
              uuid,
            },
            error,
          },
        },
      },
    } = await this.props.chooseDepartmentMutation({
      variables: {
        brandId: brand,
        department,
        uuid: this.state.uuid,
      },
    });

    if (!error) {
      this.props.storage.set('token', token);
      this.props.storage.set('auth', {
        department,
        role: departmentsByBrand[brand][department],
        uuid,
      });

      // This function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();
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
            onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
            handleOnBackClick={this.handleOnBackClick}
          />
        );
      }
      default:
        return null;
    }
  };

  render() {
    const {
      loading,
    } = this.state;

    return (
      <div className="auth">
        <Preloader isVisible={loading} />
        <div className="auth__logo">
          <img src={getBackofficeBrand().themeConfig.logo} alt="logo" />
        </div>
        <div className="auth__page">{this.renderSignIn()}</div>
        <Copyrights />
      </div>
    );
  }
}

export default withStorage(SignIn);
