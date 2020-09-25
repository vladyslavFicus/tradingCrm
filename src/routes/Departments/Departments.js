import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import { getBackofficeBrand } from 'config';
import { Link } from 'components/Link';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import DepartmentItem from 'components/DepartmentItem';
import Copyrights from 'components/Copyrights';
import setBrandIdByUserToken from 'utils/setBrandIdByUserToken';
import ChooseDepartmentMutation from './graphql/ChooseDepartmentMutation';
import './Departments.scss';

class Departments extends PureComponent {
  static propTypes = {
    chooseDepartment: PropTypes.func.isRequired,
    brands: PropTypes.arrayOf(PropTypes.brand).isRequired,
    brand: PropTypes.brand.isRequired,
    ...PropTypes.router,
    ...withStorage.propTypes,
  }

  handleSelectDepartment = async ({ department, role }) => {
    const { brand, chooseDepartment, storage, history } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartment({
        variables: {
          brand: brand.id,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      // The function need to refresh window.app object to get new data from token
      setBrandIdByUserToken();

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  }

  render() {
    const { brand, brands, token } = this.props;

    const backofficeLogo = getBackofficeBrand().themeConfig.logo;

    if (!brand || !token) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <div className="Departments">
        <div className="Departments__logo">
          <If condition={backofficeLogo}>
            <img src={backofficeLogo} alt="logo" />
          </If>
        </div>

        <div>
          <If condition={brands.length <= 1}>
            <div className="Departments__greeting">
              <Greeting />
            </div>
          </If>

          <div className="Departments__brand">
            <BrandItem brand={brand} isActive />
          </div>

          <If condition={brands.length > 1}>
            <div className="Departments__back">
              <Link to="/brands">{I18n.t('DEPARTMENTS.ALL_BRANDS')}</Link>
            </div>
          </If>

          <div className="Departments__list">
            {brand.departments.map(department => (
              <DepartmentItem
                key={department.name}
                department={department}
                onClick={() => this.handleSelectDepartment(department)}
              />
            ))}
          </div>
        </div>

        <Copyrights />
      </div>
    );
  }
}

export default compose(
  withRouter,
  withStorage(['brand', 'brands', 'token']),
  withRequests({
    chooseDepartment: ChooseDepartmentMutation,
  }),
)(Departments);
