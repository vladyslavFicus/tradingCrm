export default (store) => ({
  path: '*',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./container/DefaultContainer').default;
      cb(null, component)
    }, 'not-found')
  }
})
