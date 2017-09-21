import createRequestAction from '../../utils/createRequestAction';
import { sourceActionCreators as operatorSourceActionCreators } from './operator';
import { actionCreators as userSourceActionCreators } from './users';

const KEY = 'mini-profile-fetch';
const FETCH_OPERATOR_PROFILE = createRequestAction(`${KEY}/fetch-operator-profile`);
const FETCH_PLAYER_PROFILE = createRequestAction(`${KEY}/fetch-player-profile`);
const FETCH_IPS = createRequestAction(`${KEY}/fetch-ips`);

const fetchOperatorProfile = operatorSourceActionCreators.fetchProfile(FETCH_OPERATOR_PROFILE);
const fetchUserProfile = userSourceActionCreators.fetchProfile(FETCH_PLAYER_PROFILE);

const actionTypes = {
  FETCH_OPERATOR_PROFILE,
  FETCH_PLAYER_PROFILE,
  FETCH_IPS,
};

const actionCreators = {
  fetchOperatorProfile,
  fetchUserProfile,
};

export {
  actionTypes,
  actionCreators,
};
