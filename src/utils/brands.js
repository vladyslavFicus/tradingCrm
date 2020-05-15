import { brandsConfig, departmentsConfig, rolesConfig } from '../constants/brands';

const mapBrands = brands => brands
  .map((brand, index) => ({
    id: `${brand}_${index}`,
    name: brand.name || brand,
    image: brand.image || { src: '/img/image-placeholder.svg' },
    brand,
    ...brandsConfig[brand],
  }))
  .filter(brand => !!brand);

const mapDepartments = ({ id, role, department }) => ({
  id,
  department,
  role: rolesConfig[role] || role,
  ...departmentsConfig[department],
});

export {
  mapBrands,
  mapDepartments,
};
