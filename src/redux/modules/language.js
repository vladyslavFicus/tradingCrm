import { SET_LOCALE } from 'react-redux-i18n';

function setLocale(language) {
  return {
    type: SET_LOCALE,
    locale: language,
  };
}

const initialState = null;
const actionHandlers = {
  [SET_LOCALE]: (state, action) => action.locale,
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {};
const actionCreators = {
  setLocale,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
