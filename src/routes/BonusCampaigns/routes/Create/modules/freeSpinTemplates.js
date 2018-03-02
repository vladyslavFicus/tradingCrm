import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import {
  sourceActionCreators as freeSpinTemplatesActionCreators,
} from '../../../../../redux/modules/freeSpinTemplates';

const KEY = 'bonus-campaign/create/settings';
const CREATE_FREE_SPIN_TEMPLATE = createRequestAction(`${KEY}/create-free-spin-template`);
const FETCH_FREE_SPINS_TEMPLATES = createRequestAction(`${KEY}/fetch-free-spin-templates`);
const FETCH_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/fetch-free-spin-template`);

const fetchFreeSpinTemplates = freeSpinTemplatesActionCreators.fetchFreeSpinTemplates(FETCH_FREE_SPINS_TEMPLATES);
const fetchFreeSpinTemplate = freeSpinTemplatesActionCreators.fetchFreeSpinTemplate(FETCH_FREE_SPINS_TEMPLATE);

function createFreeSpinTemplate(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'free_spin_template/templates',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_FREE_SPIN_TEMPLATE.REQUEST,
          {
            type: CREATE_FREE_SPIN_TEMPLATE.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');

              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => ({
                  templateUUID: json.uuid,
                  bonusLifeTime: json.bonusLifeTime,
                  claimable: json.claimable,
                  wagerWinMultiplier: json.multiplier,
                }));
              }
            },
          },
          CREATE_FREE_SPIN_TEMPLATE.FAILURE,
        ],
        bailout: !logged,
      },
    });
  };
}

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  receivedAt: null,
};

const actionHandlers = {
  [FETCH_FREE_SPINS_TEMPLATES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FREE_SPINS_TEMPLATES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload.map(i => ({
      uuid: i.uuid,
      name: i.name,
    })),
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FREE_SPINS_TEMPLATES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }),
};

const actionTypes = {
  CREATE_FREE_SPIN_TEMPLATE,
  FETCH_FREE_SPINS_TEMPLATES,
};
const actionCreators = {
  fetchFreeSpinTemplates,
  createFreeSpinTemplate,
  fetchFreeSpinTemplate,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
