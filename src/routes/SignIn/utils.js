import { departmentsConfig, rolesConfig } from 'constants/brands';

const getMappedBrands = (brandToAuthorities) => {
  const brands = Object.keys(brandToAuthorities);

  return brands.map(brand => ({
    id: brand,
    departments: brandToAuthorities[brand].map(({ id, department, role }) => ({
      id,
      department,
      role: rolesConfig[role] || role,
      name: departmentsConfig[department]?.name || department,
      image: departmentsConfig[department]?.image || '/img/image-placeholder.svg',
    })),
  }));
};

export {
  getMappedBrands,
};
