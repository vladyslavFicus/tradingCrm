import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { Redirect } from 'react-router-dom';
import { get } from 'lodash';
import { getBackofficeBrand } from 'config';
import PropTypes from '../../../constants/propTypes';
import Preloader from '../../../components/Preloader';
import { Brands, Departments } from '../../../components/Brands';
import Copyrights from '../../../components/Copyrights';
import { mapBrands, mapDepartments } from '../../../utils/brands';
import history from '../../../router/history';

class BrandsView extends Component {
  static propTypes = {
    departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    token: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    changeDepartment: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  };

  mounted = false;

  resetStateTimeout = null;

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      brand: null,
      brands: mapBrands(Object.keys(props.departmentsByBrand)),
      departments: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    this.props.client.resetStore();

    setTimeout(() => {
      this.updateState({ loading: false });
    }, 300);
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.resetStateTimeout) {
      clearTimeout(this.resetStateTimeout);

      this.resetStateTimeout = null;
    }
  }

  updateState = (...args) => {
    if (this.mounted) {
      this.setState(...args);
    }
  };

  handleSelectBrand = (brand) => {
    let departments = [];

    if (brand) {
      const { departmentsByBrand } = this.props;
      const brandDepartments = departmentsByBrand[brand.brand];
      departments = Object.keys(brandDepartments).map(mapDepartments(brandDepartments));

      if (departments.length === 1) {
        return this.handleSelectDepartment(brand.brand, departments[0].id);
      }
    }

    return this.updateState({ brand, departments });
  };

  handleSelectDepartment = async (brand, department) => {
    const {
      changeDepartment,
      fetchAuthorities,
      token,
      uuid,
    } = this.props;

    this.updateState({ loading: true }, async () => {
      const action = await changeDepartment(department, brand, token);

      this.resetStateTimeout = setTimeout(() => this.updateState({ loading: false }), 2000);

      if (action) {
        if (!action.error) {
          await fetchAuthorities(uuid, action.payload.token);

          history.replace('/');
        } else {
          throw new SubmissionError({
            _error: get(action.payload, 'response.error', action.payload.message),
          });
        }
      }
    });
  };

  render() {
    const {
      loading,
      brand,
      brands,
      departments,
    } = this.state;

    if (brands.length < 2) {
      return <Redirect to="/" />;
    }

    return (
      <div className="form-page-container">
        <Preloader show={loading} />
        <div className="form-page__logo">
          <img src={getBackofficeBrand().themeConfig.logo} alt="logo" />
        </div>

        <Brands
          logged
          activeBrand={brand}
          brands={brands}
          onSelect={this.handleSelectBrand}
        />

        <Departments
          logged={!!brand}
          brand={brand}
          canGoBack={brands.length > 1}
          departments={departments}
          onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
          onBackClick={() => this.handleSelectBrand(null)}
        />

        <Copyrights />
      </div>
    );
  }
}

export default BrandsView;
