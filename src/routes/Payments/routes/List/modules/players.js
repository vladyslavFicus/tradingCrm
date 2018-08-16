import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import { actionCreators as profileActionCreators } from '../../../../../redux/modules/profile';

const KEY = 'transactions/players';
const FETCH_PROFILE = createRequestAction(`${KEY}/fetch-profile`);
const RESET_PLAYERS_PROFILES = `${KEY}/reset`;

const fetchPlayerProfile = profileActionCreators.fetchProfile(FETCH_PROFILE);

function resetPlayerProfiles() {
  return { type: RESET_PLAYERS_PROFILES };
}

const initialState = {};
const actionHandlers = {
  [FETCH_PROFILE.SUCCESS]: (state, action) => ({
    ...state,
    [action.payload.playerUUID]: action.payload,
  }),
  [RESET_PLAYERS_PROFILES]: () => ({}),
};
const actionTypes = {
  FETCH_PROFILE,
  RESET_PLAYERS_PROFILES,
};
const actionCreators = {
  fetchPlayerProfile,
  resetPlayerProfiles,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
