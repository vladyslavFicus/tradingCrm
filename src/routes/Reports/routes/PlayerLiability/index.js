import { actionCreators } from './modules/player-liability';

export default (store) => ({
  path: 'player-liability',
  onEnter: (nextState, replace, cb) => {
    store.dispatch(actionCreators.fetchReport())
      .then(() => {
        replace({ path: '/' });

        cb();
      }, () => cb());
  }
});
