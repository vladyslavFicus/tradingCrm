import { actionCreators as authActionCreators } from '../../redux/modules/auth';

export default store => ({
  path: 'logout',
  async onEnter(nextState, replace, cb) {
    await store.dispatch(authActionCreators.logout());
    replace('/sign-in');

    cb();
  },
});
