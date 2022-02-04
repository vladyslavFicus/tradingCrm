import React, { PureComponent } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { getBackofficeBrand } from 'config';
import { withRequests } from 'apollo';
import { withStorage } from 'providers/StorageProvider';
import PropTypes from 'constants/propTypes';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import Copyrights from 'components/Copyrights';
import Preloader from 'components/Preloader';
import BrandsQuery from './graphql/BrandsQuery';
import { getMappedBrands } from './util';
import './ChooseBrands.scss';

class ChooseBrands extends PureComponent {
  static propTypes = {
    ...withStorage.propTypes,
    onChosen: PropTypes.func.isRequired,
    brandsQuery: PropTypes.query({
      brandToAuthorities: PropTypes.object,
      brands: PropTypes.arrayOf(PropTypes.brand),
    }).isRequired,
  }

  componentDidUpdate() {
    const brands = this.getBrands();

    if (brands.length === 1) {
      this.handleSelectBrand(brands[0]);
    }
  }

  getBrands = () => {
    const brandToAuthorities = this.props.brandsQuery?.data?.brandToAuthorities || {};
    const brands = this.props.brandsQuery?.data?.brands || [];

    return getMappedBrands(brandToAuthorities, brands);
  };

  handleSelectBrand = (brand) => {
    const { storage, onChosen } = this.props;

    storage.set('brand', brand);

    onChosen(brand, this.getBrands());
  }

  render() {
    const { brandsQuery } = this.props;

    const backofficeLogo = getBackofficeBrand().themeConfig.logo;

    const brands = this.getBrands();

    if (brandsQuery.loading) {
      return <Preloader />;
    }

    return (
      <div className="ChooseBrands">
        <div className="ChooseBrands__logo">
          <If condition={backofficeLogo}>
            <img src={backofficeLogo} alt="logo" />
          </If>
        </div>

        <div>
          <div className="ChooseBrands__greeting">
            <Greeting />
          </div>

          <div className="ChooseBrands__message">{I18n.t('BRANDS.CHOOSE_BRAND')}</div>

          <div className="ChooseBrands__list">
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
  withStorage,
  withRequests({
    brandsQuery: BrandsQuery,
  }),
)(ChooseBrands);
