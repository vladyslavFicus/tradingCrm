import React, { useEffect, useState } from 'react';
import compose from 'compose-function';
import I18n from 'i18n-js';
import { getBackofficeBrand, getCrmBrandStaticFileUrl } from 'config';
import { withStorage } from 'providers/StorageProvider';
import Greeting from 'components/Greeting';
import BrandItem from 'components/BrandItem';
import Copyrights from 'components/Copyrights';
import Preloader from 'components/Preloader';
import './ChooseBrands.scss';
import { BrandToAuthorities } from '__generated__/types';
import { useBrandsQuery } from './graphql/__generated__/BrandsQuery';

type Props = {
  storage: Storage,
  onChosen: (brand: BrandToAuthorities, showAuthorityGreeting: boolean, showAuthorityBackButton: boolean) => void,
}

const ChooseBrands = (props: Props) => {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [brands, setBrands] = useState<Array<BrandToAuthorities>>([]);

  const crmBrandId = getBackofficeBrand().id || '';

  const { data, loading } = useBrandsQuery({
    fetchPolicy: 'network-only',
    variables: { crmBrand: crmBrandId },
    skip: !crmBrandId,
    onCompleted: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (data?.brandToAuthorities && !loading) {
      setBrands(data.brandToAuthorities.map(value => value as BrandToAuthorities));
    }
  }, [data, loading]);

  const handleSelectBrand = (
    brand: BrandToAuthorities, showAuthorityGreeting: boolean, showAuthorityBackButton: boolean,
  ) => {
    const { storage, onChosen } = props;

    storage.set('brand', brand);

    onChosen(brand, showAuthorityGreeting, showAuthorityBackButton);
  };

  if (isLoading) {
    return <Preloader />;
  }

  // if only one brand is present - choose it automatically
  if (brands.length === 1) {
    handleSelectBrand(brands[0], true, false);
  }

  return (
    <div className="ChooseBrands">
      <div className="ChooseBrands__logo">
        <img
          alt="logo"
          src={getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      <div>
        <div className="ChooseBrands__greeting">
          <Greeting />
        </div>

        <div className="ChooseBrands__message">{I18n.t('BRANDS.CHOOSE_BRAND')}</div>

        <div className="ChooseBrands__list">
          {brands.map((_brand: BrandToAuthorities) => (
            <BrandItem
              key={_brand.id}
              brand={_brand}
              onClick={() => handleSelectBrand(_brand, !brands.length, !!brands.length)}
            />
          ))}
        </div>
      </div>

      <Copyrights />
    </div>
  );
};

export default compose(
  React.memo,
  withStorage,
)(ChooseBrands);
