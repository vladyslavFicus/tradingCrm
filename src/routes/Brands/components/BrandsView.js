import React, { Component } from 'react';
import { withStorage } from 'providers/StorageProvider';
import { getBackofficeBrand } from 'config';
import PropTypes from 'constants/propTypes';
import Preloader from 'components/Preloader';
import Brands from 'components/Brands';
import Departments from 'components/Departments';
import Copyrights from 'components/Copyrights';
import { mapDepartments } from 'utils/brands';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';

class BrandsView extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    departmentsByBrand: PropTypes.object.isRequired,
    chooseDepartmentMutation: PropTypes.func.isRequired,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    ...withStorage.propTypes,
  };

  state = {
    departments: [],
    loading: true,
    brand: null,
    step: 1,
  };

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 500);
  }

  componentDidUpdate() {
    const { step, brand, departments, loading } = this.state;

    if (step === 2 && departments.length === 1) {
      return this.handleSelectDepartment(brand.brand, departments[0].id);
    }

    return loading === true ? this.removePreloader() : null;
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSelectBrand = (brand) => {
    if (brand) {
      const { departmentsByBrand, client, storage } = this.props;

      const brandDepartments = departmentsByBrand[brand.brand];
      const departments = Object.keys(brandDepartments).map(mapDepartments(brandDepartments));

      this.setState({
        loading: true,
        departments,
        step: 2,
        brand,
      }, () => {
        storage.set('departments', departments);
      });

      client.resetStore();
    }
  };

  handleSelectDepartment = async (brand, department) => {
    const { departmentsByBrand, history } = this.props;

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

    return history.push('/dashboard');
  };

  handleOnBackClick = () => {
    this.setState({ step: 1 });
  };

  renderSignIn = () => {
    const { brands } = this.props;
    const {
      departments,
      brand,
      step,
    } = this.state;

    switch (step) {
      case 1:
        return (
          <Brands
            brands={brands}
            onSelect={this.handleSelectBrand}
          />
        );
      case 2: {
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

export default withStorage(['brands', 'departmentsByBrand'])(BrandsView);
