import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'sign-in',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      injectReducer(store, { key: 'signIn', reducer: require('./modules/signIn').default });
      cb(null, require('./containers/SignInContainer').default);
    }, 'sign-in');
  },
});
