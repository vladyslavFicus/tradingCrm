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
    brandToAuthorities: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
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
    this.timerID = setTimeout(() => this.setState({ loading: false }), 500);
  }

  componentDidUpdate() {
    const { step, brand, departments, loading } = this.state;

    if (step === 2 && departments.length === 1) {
      return this.handleSelectDepartment(brand.brand, departments[0]);
    }

    if (step === 3) {
      return null;
    }

    return loading === true ? this.removePreloader() : null;
  }

  componentWillUnmount() {
    clearTimeout(this.timerID);
  }

  removePreloader = () => {
    this.setState({ loading: false });
  };

  handleSelectBrand = (brand) => {
    if (brand) {
      const { brandToAuthorities, storage, client } = this.props;

      const brandDepartments = brandToAuthorities[brand.brand];
      const departments = brandDepartments.map(brandDepartment => mapDepartments(brandDepartment));

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

  handleSelectDepartment = async (brand, { department, role }) => {
    const { chooseDepartmentMutation, history, storage } = this.props;

    // Should be covered as callback because this method called from componentDidUpdate several times and make logout
    this.setState({ step: 3, loading: true }, async () => {
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
      } = await chooseDepartmentMutation({
        variables: { brand, department, role },
      });

      if (!error) {
        storage.set('token', token);
        storage.set('auth', { department, role, uuid });

        // This function need to refresh window.app object to get new data from token
        setBrandIdByUserToken();
      }

      history.push('/dashboard');
    });
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

export default withStorage(['brands', 'brandToAuthorities'])(BrandsView);
