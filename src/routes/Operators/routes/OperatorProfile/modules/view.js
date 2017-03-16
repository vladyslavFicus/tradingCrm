// import { CALL_API } from 'redux-api-middleware';
// import createRequestAction from 'utils/createRequestAction';
// import timestamp from 'utils/timestamp';

const operatorProfileInitialState = {
  data: {
    operatorId: 'af2f614a-bc85-4bea-b910-20124e1acee7',
    firstName: 'Jimmy',
    lastName: 'Black',
    country: 'United Kingdom',
    registered: '2017-02-02T12:12:12',
    status: 'INACTIVE',
    statusChanged: '2017-02-02T11:11:11',
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};

function reducer(handlers, state, action) {
  // const handler = handlers[action.type];
  //
  // return handler ? handler(state, action) : state;
  return {
    ...state,
    ...operatorProfileInitialState,
  };
}

export const initialState = {
  operatorProfile: operatorProfileInitialState,
};

export default reducer;
