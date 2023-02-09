import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { withStorage } from 'providers/StorageProvider';
import { BrandToAuthorities } from '../../__generated__/types';
import ChooseBrands from './components/ChooseBrands';
import ChooseAuthority from './components/ChooseAuthority';

type Props = {
  token?: string,
}

const Brands = (props: Props) => {
  const { token } = props;

  if (!token) {
    return <Redirect to="/sign-in" />;
  }

  const [brand, setBrand] = useState<BrandToAuthorities | null>(null);
  const [showAuthorityGreeting, setShowAuthorityGreeting] = useState<boolean>(false);
  const [showAuthorityBackButton, setShowAuthorityBackButton] = useState<boolean>(false);

  const onBrandChosen = (
    _brand: BrandToAuthorities,
    _showAuthorityGreeting: boolean,
    _setShowAuthorityBackButton: boolean,
  ) => {
    setBrand(_brand);
    setShowAuthorityGreeting(_showAuthorityGreeting);
    setShowAuthorityBackButton(_setShowAuthorityBackButton);
  };

  const onAuthorityBackClick = () => setBrand(null);

  return (
    <Choose>
      <When condition={!!brand}>
        <ChooseAuthority
          brand={brand}
          onBackClick={onAuthorityBackClick}
          showGreeting={showAuthorityGreeting}
          showBackButton={showAuthorityBackButton}
        />
      </When>

      <Otherwise>
        <ChooseBrands onChosen={onBrandChosen} />
      </Otherwise>
    </Choose>
  );
};

export default withStorage(['token'])(Brands);
