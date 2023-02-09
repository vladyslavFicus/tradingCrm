import React, { useEffect, useState } from 'react';
import compose from 'compose-function';
import { Redirect } from 'react-router-dom';
import { getBackofficeBrand } from 'config';
import { BrandToAuthorities } from '__generated__/types';
import { withStorage } from 'providers/StorageProvider';
import Preloader from 'components/Preloader';
import BrandsList from './components/BrandsList';
import DepartmentsList from './components/DepartmentsList';
import { useBrandsQuery } from './graphql/__generated__/BrandsQuery';

type Props = {
  token: string,
};

const Brands = (props: Props) => {
  const { token } = props;

  const [brand, setBrand] = useState<BrandToAuthorities | null>(null);

  // ===== Requests ===== //
  const { data, loading } = useBrandsQuery({
    variables: { crmBrand: getBackofficeBrand().id },
  });

  const brands = data?.brandToAuthorities || [];
  const isSingleBrand = brands.length === 1;

  // ===== Handlers ===== //
  const handleSelectBrand = (selectedBrand: BrandToAuthorities) => {
    setBrand(selectedBrand);
  };

  const handleBackClick = () => {
    setBrand(null);
  };

  // ===== Effects ===== //
  useEffect(() => {
    if (isSingleBrand) {
      setBrand(brands[0]);
    }
  }, [brands]);

  // Redirect to sign-in page if token not found
  if (!token) {
    return <Redirect to="/sign-in" />;
  }

  // Render loadin while brands BrandsQuery handle
  if (loading) {
    return <Preloader />;
  }

  // Show brand select list while brand not selected
  if (!brand) {
    return <BrandsList brands={brands} onSelect={handleSelectBrand} />;
  }

  // Show departament select list if brand selected
  return <DepartmentsList brand={brand} isSingleBrand={isSingleBrand} onBackClick={handleBackClick} />;
};

export default compose(
  React.memo,
  withStorage(['token']),
)(Brands);
