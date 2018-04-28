import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import {
  sourceActionCreators as bonusTemplatesActionCreators,
} from '../../../../../../../redux/modules/campaigns/bonusTemplates';

import { customValueFieldTypes } from '../../../../../../../constants/form';

const KEY = 'user-bonus';
const FETCH_BONUS_TEMPLATES = createRequestAction(`${KEY}/fetch-bonus-templates`);
const FETCH_BONUS_TEMPLATE = createRequestAction(`${KEY}/fetch-bonus-template`);

const CREATE_BONUS_TEMPLATE = createRequestAction(`${KEY}/create-bonus-template`);
const ASSIGN_BONUS_TEMPLATE = createRequestAction(`${KEY}/assign-bonus-template`);
const ADD_BONUS_TEMPLATE = `${KEY}/add-bonus-template`;

const fetchBonusTemplates = bonusTemplatesActionCreators.fetchBonusTemplates(FETCH_BONUS_TEMPLATES);
const fetchBonusTemplate = bonusTemplatesActionCreators.fetchBonusTemplate(FETCH_BONUS_TEMPLATE);
const createBonusTemplate = bonusTemplatesActionCreators.createBonusTemplate(CREATE_BONUS_TEMPLATE);
const assignBonusTemplate = bonusTemplatesActionCreators.assignBonusTemplate(ASSIGN_BONUS_TEMPLATE);

const initialState = {
  data: [],
  currency: null,
  isLoading: false,
  error: null,
  receivedAt: null,
};

function addBonusTemplate(name, uuid) {
  return {
    type: ADD_BONUS_TEMPLATE,
    payload: { name, uuid },
  };
}

const actionHandlers = {
  [FETCH_BONUS_TEMPLATES.REQUEST]: (state, { payload }) => ({
    ...state,
    currency: payload.currency,
    isLoading: true,
    error: null,
  }),
  [FETCH_BONUS_TEMPLATES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload
      .filter(i => (
        i.grantRatio
        && i.grantRatio.ratioType === customValueFieldTypes.ABSOLUTE
        && i.grantRatio.value
        && i.grantRatio.value.some(c => c.currency === state.currency)
      ))
      .map(i => ({ uuid: i.uuid, name: i.name })),
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
  FETCH_BONUS_TEMPLATES,
  CREATE_BONUS_TEMPLATE,
  ASSIGN_BONUS_TEMPLATE,
};
const actionCreators = {
  fetchBonusTemplates,
  createBonusTemplate,
  assignBonusTemplate,
  fetchBonusTemplate,
  addBonusTemplate,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
