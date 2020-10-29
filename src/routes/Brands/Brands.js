import React, { PureComponent } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { compose } from 'react-apollo';
import I18n from 'i18n-js';
import { getBackofficeBrand } from 'config';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import Copyrights from 'components/Copyrights';
import ChooseDepartmentMutation from './graphql/ChooseDepartmentMutation';
import './Brands.scss';

class Brands extends PureComponent {
  static propTypes = {
    chooseDepartment: PropTypes.func.isRequired,
    ...PropTypes.router,
    ...withStorage.propTypes,
  }

  handleSelectBrand = (brand) => {
    const { storage, history } = this.props;

    const { id: brandId, departments } = brand;

    storage.set('brand', brand);

    if (departments.length === 1) {
      this.handleSelectDepartment(brandId, departments[0]);
    } else {
      history.push('/departments');
    }
  }

  handleSelectDepartment = async (brandId, { department, role }) => {
    const { chooseDepartment, storage, history } = this.props;

    try {
      const { data: { auth: { chooseDepartment: { token, uuid } } } } = await chooseDepartment({
        variables: {
          brand: brandId,
          department,
          role,
        },
      });

      storage.set('token', token);
      storage.set('auth', { department, role, uuid });

      history.push('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  }

  render() {
    const { brands, token } = this.props;

    const backofficeLogo = getBackofficeBrand().themeConfig.logo;

    if (!brands || !token) {
      return <Redirect to="/sign-in" />;
    }

    return (
      <div className="Brands">
        <div className="Brands__logo">
          <If condition={backofficeLogo}>
            <img src={backofficeLogo} alt="logo" />
          </If>
        </div>

        <div>
          <div className="Brands__greeting">
            <Greeting />
          </div>

          <div className="Brands__message">{I18n.t('BRANDS.CHOOSE_BRAND')}</div>

          <div className="Brands__list">
            {brands.map(brand => (
              <BrandItem
                key={brand.id}
                brand={brand}
                onClick={() => this.handleSelectBrand(brand)}
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
  withStorage(['brands', 'token']),
  withRequests({
    chooseDepartment: ChooseDepartmentMutation,
  }),
)(Brands);
