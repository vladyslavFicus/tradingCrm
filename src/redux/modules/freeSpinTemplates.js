import { CALL_API } from 'redux-api-middleware';

function fetchFreeSpinTemplates(type) {
  return () => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'free_spin_template/templates',
        method: 'GET',
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

function fetchFreeSpinTemplate(type) {
  return uuid => (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: `free_spin_template/templates/${uuid}`,
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        types: [
          type.REQUEST,
          {
            type: type.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');

              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => json);
              }
            },
          },
          type.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}


const sourceActionCreators = {
  fetchFreeSpinTemplates,
  fetchFreeSpinTemplate,
};

export {
  sourceActionCreators,
};
