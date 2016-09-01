import { WEB_API, ContentType } from 'constants/index';
import { actionTypes as authActionTypes } from 'redux/modules/auth';

function login(username, password) {
  return (dispatch, getState) => dispatch({
    [WEB_API]: {
      method: 'POST',
      endpoint: 'auth/signin',
      endpointParams: {
        username,
        password,
      },
      types: [authActionTypes.LOGIN_REQUEST, authActionTypes.LOGIN_SUCCESS, authActionTypes.LOGIN_FAILURE],
    },
  });
}

const handlers = {
  [authActionTypes.LOGIN_REQUEST]: (state, action) => ({
    ...state,
    isOnRequest: true,
    isSuccess: false,
    isFailure: false,
    failureMessage: null,
  }),
  [authActionTypes.LOGIN_SUCCESS]: function (state, action) {
    if (action.response.token) {
      return {
        ...state,
        token: action.response.token,
        uuid: action.response.userUuid,
        isSuccess: true,
        isOnRequest: false,
        isFailure: false,
        failureMessage: null,
      };
    }

    return state;
  },

  [authActionTypes.LOGIN_FAILURE]: function (state, action) {
    const newState = {
      ...state,
      isOnRequest: false,
      isSuccess: false,
      isFailure: true,
    };

    if (action.error.message) {
      newState.failureMessage = action.error.message;
    }

    return newState;
  },
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  token: null,
  uuid: null,
  isSuccess: false,
  isOnRequest: false,
  isFailure: false,
  failureMessage: null,
};

function reducer(state = initialState, action) {
  const handler = handlers[action.type];

  return handler ? handler(state, action) : state;
}

const actionTypes = {};
const actionCreators = {
  login,
};

export {
  actionTypes,
  actionCreators
};

export default reducer;
