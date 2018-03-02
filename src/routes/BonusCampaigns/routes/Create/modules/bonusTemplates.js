import { CALL_API } from 'redux-api-middleware';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

import {
  sourceActionCreators as bonusTemplatesActionCreators,
} from '../../../../../redux/modules/bonusTemplates';

const KEY = 'bonus-campaign/create/settings';
const FETCH_BONUS_TEMPLATES = createRequestAction(`${KEY}/fetch-bonus-templates`);
const FETCH_BONUS_TEMPLATE = createRequestAction(`${KEY}/fetch-bonus-template`);
const CREATE_BONUS_TEMPLATE = createRequestAction(`${KEY}/create-bonus-template`);

const fetchBonusTemplates = bonusTemplatesActionCreators.fetchBonusTemplates(FETCH_BONUS_TEMPLATES);
const fetchBonusTemplate = bonusTemplatesActionCreators.fetchBonusTemplate(FETCH_BONUS_TEMPLATE);

function createBonusTemplate(data) {
  return (dispatch, getState) => {
    const { auth: { token, logged } } = getState();

    return dispatch({
      [CALL_API]: {
        endpoint: 'bonus_template/templates',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        types: [
          CREATE_BONUS_TEMPLATE.REQUEST,
          {
            type: CREATE_BONUS_TEMPLATE.SUCCESS,
            payload: (action, state, res) => {
              const contentType = res.headers.get('Content-Type');

              if (contentType && ~contentType.indexOf('json')) {
                return res.json().then(json => ({
                  templateUUID: json.uuid,
                }));
              }
            },
          },
          CREATE_BONUS_TEMPLATE.FAILURE,
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
  [FETCH_BONUS_TEMPLATES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_BONUS_TEMPLATES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload.map(i => ({
      uuid: i.uuid,
      name: i.name,
    })),
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_BONUS_TEMPLATES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }),
};

const actionTypes = {
  CREATE_BONUS_TEMPLATE,
  FETCH_BONUS_TEMPLATES,
};
const actionCreators = {
  createBonusTemplate,
  fetchBonusTemplates,
  fetchBonusTemplate,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
