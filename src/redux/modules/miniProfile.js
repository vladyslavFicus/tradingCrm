import createRequestAction from '../../utils/createRequestAction';
import { sourceActionCreators as operatorSourceActionCreators } from './operator';
import { actionCreators as userSourceActionCreators } from './users';
import { sourceActionCreators as ipsSourceActionCreators } from './ip';

const KEY = 'mini-profile-fetch';
const FETCH_OPERATOR_PROFILE = createRequestAction(`${KEY}/fetch-operator-profile`);
const FETCH_PLAYER_PROFILE = createRequestAction(`${KEY}/fetch-player-profile`);
const FETCH_IPS = createRequestAction(`${KEY}/fetch-ips`);

const fetchOperatorProfile = operatorSourceActionCreators.fetchProfile(FETCH_OPERATOR_PROFILE);
const fetchUserMiniProfile = userSourceActionCreators.fetchProfile(FETCH_PLAYER_PROFILE);
const fetchIps = ipsSourceActionCreators.fetchEntities(FETCH_IPS);

function fetchOperatorMiniProfile(operatorUUID) {
  return dispatch => Promise.all([
    dispatch(fetchOperatorProfile(operatorUUID)),
    dispatch(fetchIps(operatorUUID)),
  ]).then((actions) => {
    let result = {};

    actions.map((action) => {
      if (action.type === FETCH_OPERATOR_PROFILE.SUCCESS) {
        result = {
          ...result,
          ...action.payload,
        };
      } else if (action.type === FETCH_IPS.SUCCESS) {
        result.lastIp = action.payload.length > 0 ? action.payload[0] : null;
      }
    });

    return {
      payload: result,
    };
  });
}

const actionTypes = {
  FETCH_OPERATOR_PROFILE,
  FETCH_PLAYER_PROFILE,
  FETCH_IPS,
};

const actionCreators = {
  fetchOperatorProfile,
  fetchUserMiniProfile,
  fetchOperatorMiniProfile,
};

export {
  actionTypes,
  actionCreators,
};
