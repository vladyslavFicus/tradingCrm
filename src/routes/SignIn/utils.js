import { brandsConfig, departmentsConfig, rolesConfig } from 'constants/brands';

const getMappedBrands = (brandToAuthorities) => {
  const brandsNames = Object.keys(brandToAuthorities);

  return brandsNames.map(brand => ({
    id: brand,
    name: brandsConfig[brand]?.name || brand,
    image: brandsConfig[brand]?.image?.src || '/img/image-placeholder.svg',
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
