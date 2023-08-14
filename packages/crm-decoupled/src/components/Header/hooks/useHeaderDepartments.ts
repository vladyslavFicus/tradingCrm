import { useCallback, useState } from 'react';
import { Brand, useStorage } from '@crm/common';
import { Authority } from '__generated__/types';
import { useChooseDepartmentMutation } from '../graphql/__generated__/ChooseDepartmentsMutation';

const useHeaderDepartments = () => {
  const [isOpen, setOpen] = useState(false);

  // ===== Storage ===== //
  const storage = useStorage();
  const { id, authorities } = storage.get('brand') as Brand;
  const auth = storage.get('auth');

  const [chooseDepartment] = useChooseDepartmentMutation();

  const toggleDropdown = useCallback(() => setOpen(value => !value), []);

  const changeDepartment = useCallback(({ department, role }: Authority) => async () => {
    try {
      const { data } = await chooseDepartment({
        variables: {
          brand: id,
          department,
          role,
        },
      });

      const { token, uuid } = data?.auth?.chooseDepartment || {};

      storage.set('auth', { uuid, department, role });
      storage.set('token', token);
    } catch (e) {
      // Do nothing...
    }
  }, [chooseDepartment, id]);

  const currentDepartment = authorities.find(({ department }) => auth.department === department);
  const departmentsLeft = authorities.filter(({ department }) => auth.department !== department);

  return { isOpen, toggleDropdown, changeDepartment, currentDepartment, departmentsLeft };
};

export default useHeaderDepartments;
