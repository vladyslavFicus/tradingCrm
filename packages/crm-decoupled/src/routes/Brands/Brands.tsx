import React from 'react';
import { Navigate } from 'react-router-dom';
import { Preloader } from 'components';
import { BrandToAuthorities } from '../../__generated__/types';
import useBrands from './hooks/useBrands';
import { BrandsList, DepartmentsList } from './layouts';

const Brands = () => {
  const {
    isSingleBrand,
    brand,
    brands,
    token,
    loading,
    handleSelectBrand,
    handleBackClick,
  } = useBrands();

  // Redirect to sign-in page if token not found
  if (!token) {
    return <Navigate replace to="/sign-in" />;
  }

  // Render loadin while brands BrandsQuery handle
  if (loading) {
    return <Preloader />;
  }

  // Show brand select list while brand not selected
  if (!brand && brands) {
    return <BrandsList brands={brands} onSelect={handleSelectBrand} />;
  }

  // Show departament select list if brand selected
  return (
    <DepartmentsList
      brand={brand as BrandToAuthorities}
      isSingleBrand={isSingleBrand}
      onBackClick={handleBackClick}
    />
  );
};

export default React.memo(Brands);
