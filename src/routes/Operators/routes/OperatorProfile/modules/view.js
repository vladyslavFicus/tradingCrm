// import { CALL_API } from 'redux-api-middleware';
import createRequestAction from 'utils/createRequestAction';
// import timestamp from 'utils/timestamp';
import { sourceActionCreators as operatorSourceActionCreators } from 'redux/modules/operator';

const KEY = 'operator-profile/view';
const RESET_PASSWORD = createRequestAction(`${KEY}/reset-password`);

const resetPassword = operatorSourceActionCreators.passwordResetRequest(RESET_PASSWORD);

const operatorProfileInitialState = {
  data: {
    operatorId: 'af2f614a-bc85-4bea-b910-20124e1acee7',
    firstName: 'Jimmy',
    lastName: 'Black',
    country: 'United Kingdom',
    registered: '2017-02-02T12:12:12',
    status: 'INACTIVE',
    statusChanged: '2017-02-02T11:11:11',
    email: 'email@server.com',
    phone: '123 456 789',
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

function reducer(state, action) {
  // const handler = handlers[action.type];
  //
  // return handler ? handler(state, action) : state;
  return {
    ...state,
    ...operatorProfileInitialState,
  };
}

const initialState = {
  operatorProfile: operatorProfileInitialState,
};
const actionTypes = {
  RESET_PASSWORD,
};
const actionCreators = {
  resetPassword,
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default reducer;
