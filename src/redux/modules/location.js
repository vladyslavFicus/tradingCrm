const KEY = 'location';
const LOCATION_CHANGE = `${KEY}/location-change`;

function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location,
  };
}

const updateLocation = ({ dispatch }) => (nextLocation) => dispatch(locationChange(nextLocation));

const initialState = null;

const actionHandlers = {
  [LOCATION_CHANGE]: (state, action) => action.payload,
};

const reducer = (state = initialState, action) => {
  const handler = actionHandlers[action.type];

  return handler ? handler(state, action) : state;
};

const actionTypes = {
  LOCATION_CHANGE,
};

const actionCreators = {
  locationChange,
  updateLocation,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default reducer;
