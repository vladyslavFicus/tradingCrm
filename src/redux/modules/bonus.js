import { CALL_API } from 'redux-api-middleware';
import buildQueryString from '../../utils/buildQueryString';
import { statuses } from '../../constants/bonus';

function fetchActiveBonus(type) {
  return playerUUID => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `bonus/bonuses/${playerUUID}?${buildQueryString({ states: statuses.IN_PROGRESS })}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [type.REQUEST, type.SUCCESS, type.FAILURE],
        bailout: !logged,
      },
    });
  };
}

const sourceActionCreators = {
  fetchActiveBonus,
};

export {
  sourceActionCreators,
};
