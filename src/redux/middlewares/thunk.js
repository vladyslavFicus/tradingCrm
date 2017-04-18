function getActualState(loadedState) {
  const storedState = JSON.parse(window.localStorage.getItem('nas:auth'));

  return storedState && storedState.token ? storedState.token : loadedState;
}

function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, () => {
        const { ...state } = getState();
        if (state.auth && state.auth.token) {
          state.auth.token = getActualState(state.auth.token);
        }
        return state;
      }, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
