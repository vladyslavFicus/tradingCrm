export default (store) => ({
  path: 'brands',
  onEnter(nextState, replace, cb) {
    const { auth: { departmentsByBrand } } = store.getState();

    if (Object.keys(departmentsByBrand).length < 2) {
      replace('/');
    }

    cb();
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./containers/BrandsContainer').default);
    }, 'brands');
  },
});
