import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';

import {
  sourceActionCreators as bonusTemplatesActionCreators,
} from '../../../../../redux/modules/bonusTemplates';

const KEY = 'bonus-campaign/create/settings';
const FETCH_BONUS_TEMPLATES = createRequestAction(`${KEY}/fetch-bonus-templates`);
const FETCH_BONUS_TEMPLATE = createRequestAction(`${KEY}/fetch-bonus-template`);
const CREATE_BONUS_TEMPLATE = createRequestAction(`${KEY}/create-bonus-template`);
const ADD_BONUS_TEMPLATE = `${KEY}/add-bonus-template`;

const fetchBonusTemplates = bonusTemplatesActionCreators.fetchBonusTemplates(FETCH_BONUS_TEMPLATES);
const fetchBonusTemplate = bonusTemplatesActionCreators.fetchBonusTemplate(FETCH_BONUS_TEMPLATE);
const createBonusTemplate = bonusTemplatesActionCreators.createBonusTemplate(CREATE_BONUS_TEMPLATE);

function addBonusTemplate(name, uuid) {
  return {
    type: ADD_BONUS_TEMPLATE,
    payload: { name, uuid },
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
  [ADD_BONUS_TEMPLATE]: (state, { payload }) => {
    if (state.data.findIndex(item => item.uuid === payload.uuid) !== -1) {
      return state;
    }

    const newData = [...state.data];
    newData.push(payload);

    return {
      ...state,
      data: newData,
    };
  },
};
const actionTypes = {
  ADD_BONUS_TEMPLATE,
  CREATE_BONUS_TEMPLATE,
  FETCH_BONUS_TEMPLATES,
};
const actionCreators = {
  addBonusTemplate,
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
