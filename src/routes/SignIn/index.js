import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'sign-in',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./containers/SignInContainer').default;
      const reducer = require('./modules/sign-in').default;

      injectReducer(store, { key: 'signIn', reducer });
      cb(null, component)
    }, 'sign-in')
  }
})
