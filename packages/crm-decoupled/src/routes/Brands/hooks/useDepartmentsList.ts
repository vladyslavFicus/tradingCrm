import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Config } from '@crm/common';
import { BrandToAuthorities } from '__generated__/types';
import { useStorage } from 'providers/StorageProvider';
import { useSelectDepartmentMutation } from '../graphql/__generated__/SelectDepartmentMutation';

type Props = {
  brand: BrandToAuthorities,
};

type DepartmentsList = {
  loading: boolean,
  handleSelectDepartament: (department: string, role: string) => void,
  getCrmBrandStaticFileUrl: (file: string) => string | undefined,
};

const useDepartmentsList = (props: Props): DepartmentsList => {
  const { brand } = props;

  const navigate = useNavigate();

  // ===== Storage ===== //
  const storage = useStorage();

  // ===== Requests ===== //
  const [selectDepartmentMutation, { loading }] = useSelectDepartmentMutation();

  // ===== Handlers ===== //
  const handleSelectDepartament = useCallback(async (department: string, role: string) => {
    try {
      const { data } = await selectDepartmentMutation({
        variables: {
          brand: brand.id,
          department,
          role,
        },
      });

      const { token, uuid } = data?.auth?.chooseDepartment || {};

      Config.setBrand(brand.id);

      storage.set('brand', { id: brand.id, authorities: brand.authorities });
      storage.set('auth', { uuid, role, department });
      storage.set('token', token);

      navigate('/dashboard');
    } catch (e) {
      // Do nothing...
    }
  }, [brand]);

  // ===== Effects ===== //
  useEffect(() => {
    if (brand.authorities.length === 1) {
      const { department, role } = brand.authorities[0];

      handleSelectDepartament(department, role);
    }
  }, []);

  return {
    loading,
    handleSelectDepartament,
    getCrmBrandStaticFileUrl: Config.getCrmBrandStaticFileUrl,
  };
};

export default useDepartmentsList;
