import { parsePath } from 'history/lib/PathUtils';
import createReducer from '../../utils/createReducer';

const KEY = 'location';
const LOCATION_CHANGE = `${KEY}/location-change`;

function locationChange(location = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location,
  };
}

const updateLocation = ({ dispatch }) => nextLocation => dispatch(locationChange(nextLocation));

const initialState = window.location
  ? parsePath(`${window.location.pathname}${window.location.search}${window.location.hash}`)
  : null;
const actionHandlers = {
  [LOCATION_CHANGE]: (state, action) => action.payload,
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

export default createReducer(initialState, actionHandlers);
