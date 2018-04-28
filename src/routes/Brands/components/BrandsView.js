import React, { Component } from 'react';
import { SubmissionError } from 'redux-form';
import { get } from 'lodash';
import PropTypes from '../../../constants/propTypes';
import Preloader from '../../../components/Preloader';
import { Brands, Departments } from '../../../components/Brands';
import Copyrights from '../../../components/Copyrights';
import { mapBrands, mapDepartments } from '../../../utils/brands';

class BrandsView extends Component {
  static propTypes = {
    router: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }).isRequired,
    departmentsByBrand: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    token: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    changeDepartment: PropTypes.func.isRequired,
    fetchAuthorities: PropTypes.func.isRequired,
  };
  static defaultProps = {
    brand: null,
    fullName: null,
  };

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
    setTimeout(() => {
      this.setState({ loading: false });
    }, 300);
  }

  componentWillUnmount() {
    if (this.resetStateTimeout) {
      clearTimeout(this.resetStateTimeout);

      this.resetStateTimeout = null;
    }
  }

  resetStateTimeout = null;

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

    return this.setState({ brand, departments });
  };

  handleSelectDepartment = async (brand, department) => {
    const { router, changeDepartment, fetchAuthorities, token, uuid } = this.props;

    this.setState({ loading: true }, async () => {
      const action = await changeDepartment(department, brand, token);

      this.resetStateTimeout = setTimeout(() => this.setState({ loading: false }), 2000);

      if (action) {
        if (!action.error) {
          await fetchAuthorities(uuid, action.payload.token);

          router.replace('/');
        } else {
          throw new SubmissionError({
            _error: get(action.payload, 'response.error', action.payload.message),
          });
        }
      }
    });
  };

  render() {
    const { loading, brand, brands, departments } = this.state;
    const { fullName } = this.props;

    return (
      <div className="form-page-container">
        <Preloader show={loading} />
        <div className="wrapper">
          <div className="form-page">
            <div className="form-page__logo">
              <img src="/img/horizon-logo.svg" alt="logo" />
            </div>

            <Brands
              logged
              activeBrand={brand}
              username={fullName}
              brands={brands}
              onSelect={this.handleSelectBrand}
            />

            <Departments
              logged={!!brand}
              brand={brand}
              canGoBack={brands.length > 1}
              username={fullName}
              departments={departments}
              onSelect={({ id }) => this.handleSelectDepartment(brand.brand, id)}
              onBackClick={() => this.handleSelectBrand(null)}
            />
          </div>
        </div>

        <Copyrights />
      </div>
    );
  }
}

export default BrandsView;
