import { useCallback, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { Config } from '@crm/common';
import { BrandToAuthorities } from '__generated__/types';
import { useStorageState } from 'providers/StorageProvider';
import { useBrandsQuery } from '../graphql/__generated__/BrandsQuery';

type Brands = {
  isSingleBrand: boolean,
  brand: BrandToAuthorities | null,
  brands?: Array<BrandToAuthorities>,
  token: string,
  loading: boolean,
  handleSelectBrand: (selectedBrand: BrandToAuthorities) => void,
  handleBackClick: () => void,
}

const useBrands = (): Brands => {
  const [brand, setBrand] = useState<BrandToAuthorities | null>(null);

  // ===== Storage ===== //
  const [token] = useStorageState<string>('token');

  const client = useApolloClient();

  // ===== Requests ===== //
  const { data, loading } = useBrandsQuery({
    variables: { crmBrand: Config.getBackofficeBrand().id },
    nextFetchPolicy: 'network-only',
  });

  const brands = data?.brandToAuthorities || [];
  const isSingleBrand = brands.length === 1;

  // ===== Handlers ===== //
  const handleSelectBrand = useCallback((selectedBrand: BrandToAuthorities) => {
    setBrand(selectedBrand);
  }, []);

  const handleBackClick = useCallback(() => {
    setBrand(null);
  }, []);

  // ===== Effects ===== //
  // Reset Apollo store each time, when component mounted
  useEffect(() => {
    client.resetStore();
  }, []);

  useEffect(() => {
    if (isSingleBrand) {
      setBrand(brands[0]);
    }
  }, [brands.length]);

  return {
    isSingleBrand,
    brand,
    brands,
    token,
    loading,
    handleSelectBrand,
    handleBackClick,
  };
};

export default useBrands;
