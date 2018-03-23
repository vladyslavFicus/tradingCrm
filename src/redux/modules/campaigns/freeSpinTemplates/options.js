import { CALL_API } from 'redux-api-middleware';

function fetchGameAggregators(type) {
  return () => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'free_spin_template/templates',
        method: 'OPTIONS',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          type.REQUEST,
          type.SUCCESS,
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}
const sourceActionCreators = {
  fetchGameAggregators,
};

export {
  sourceActionCreators,
};
