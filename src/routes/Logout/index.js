import { actionCreators as authActionCreators } from '../../redux/modules/auth';

export default store => ({
  path: 'logout',
  onEnter(nextState, replace, cb) {
    store.dispatch(authActionCreators.logout())
      .then(() => replace('/sign-in'))
      .then(() => cb());
  },
});
