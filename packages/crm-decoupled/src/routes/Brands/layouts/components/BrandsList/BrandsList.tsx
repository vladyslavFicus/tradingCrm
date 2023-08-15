import React from 'react';
import I18n from 'i18n-js';
import { Config } from '@crm/common';
import { BrandToAuthorities } from '__generated__/types';
import { Copyrights } from 'components';
import { getGreetingMsg } from 'routes/Brands/utils';
import BrandItem from '../BrandItem';
import './BrandsList.scss';

type Props = {
  brands: Array<BrandToAuthorities>,
  onSelect: (brand: BrandToAuthorities) => void,
};

const BrandsList = (props: Props) => {
  const { brands, onSelect } = props;

  return (
    <div className="BrandsList">
      <div className="BrandsList__logo">
        <img
          alt="logo"
          src={Config.getCrmBrandStaticFileUrl('assets/logo.svg')}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div>
        <div className="BrandsList__greeting">
          {getGreetingMsg()}
        </div>

        <div className="BrandsList__message">{I18n.t('BRANDS.CHOOSE_BRAND')}</div>

        <div className="BrandsList__list">
          {brands.map(brand => (
            <BrandItem
              key={brand.id}
              brand={brand}
              onClick={() => onSelect(brand)}
            />
          ))}
        </div>
      </div>

      <Copyrights />
    </div>
  );
};

export default React.memo(BrandsList);
