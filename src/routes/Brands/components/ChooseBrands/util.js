const getMappedBrands = (brandToAuthorities, brands) => {
  const userBrands = Object.keys(brandToAuthorities).sort();

  return userBrands.map(brand => ({
    id: brand,
    name: brands.find(_brand => _brand.brandId === brand)?.brandName,
    departments: brandToAuthorities[brand].map(({ id, department, role }) => ({
      id,
      department,
      role,
    })),
  }));
};

export {
  getMappedBrands,
};
