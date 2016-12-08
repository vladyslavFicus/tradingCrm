import Storage from 'utils/storage';

export default (store) => {
  let previousAuth = store.getState().auth;

  return store.subscribe(() => {
    const state = store.getState();
    const { token, logged } = state.auth;

    if (token !== previousAuth.token || logged !== previousAuth.logged) {
      previousAuth = state.auth;
      Storage.set('auth', previousAuth);
    }
  });
};
