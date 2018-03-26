import { get } from 'lodash';
import createReducer from '../../../../../utils/createReducer';
import createRequestAction from '../../../../../utils/createRequestAction';
import {
  sourceActionCreators as freeSpinTemplatesActionCreators,
} from '../../../../../redux/modules/campaigns/freeSpinTemplates';
import { actionTypes as optionsActionTypes } from './options';

const KEY = 'bonus-campaign/create/free-spin-templates';
const CREATE_FREE_SPIN_TEMPLATE = createRequestAction(`${KEY}/create-free-spin-template`);
const FETCH_FREE_SPINS_TEMPLATES = createRequestAction(`${KEY}/fetch-free-spin-templates`);
const FETCH_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/fetch-free-spin-template`);
const ADD_FREE_SPIN_TEMPLATE = `${KEY}/add-free-spin-template`;

const fetchFreeSpinTemplates = freeSpinTemplatesActionCreators.fetchFreeSpinTemplates(FETCH_FREE_SPINS_TEMPLATES);
const fetchFreeSpinTemplate = freeSpinTemplatesActionCreators.fetchFreeSpinTemplate(FETCH_FREE_SPINS_TEMPLATE);
const createFreeSpinTemplate = freeSpinTemplatesActionCreators.createFreeSpinTemplate(CREATE_FREE_SPIN_TEMPLATE);

function addFreeSpinTemplate(name, uuid) {
  return {
    type: ADD_FREE_SPIN_TEMPLATE,
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
  [FETCH_FREE_SPINS_TEMPLATES.REQUEST]: state => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  [FETCH_FREE_SPINS_TEMPLATES.SUCCESS]: (state, { payload, meta: { endRequestTime } }) => ({
    ...state,
    data: payload,
    isLoading: false,
    receivedAt: endRequestTime,
  }),
  [FETCH_FREE_SPINS_TEMPLATES.FAILURE]: (state, action) => ({
    ...state,
    isLoading: false,
    error: action.payload,
  }),
  [ADD_FREE_SPIN_TEMPLATE]: (state, { payload }) => {
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
  [optionsActionTypes.FETCH_GAME_AGGREGATORS.SUCCESS]: (state, { payload }) => {
    const availableFreeSpinTemplates = state.data.filter(
      i => get(payload, i.aggregatorId, []).indexOf(i.providerId) > -1
    );

    return {
      ...state,
      data: [...availableFreeSpinTemplates],
    };
  },
};
const actionTypes = {
  ADD_FREE_SPIN_TEMPLATE,
  CREATE_FREE_SPIN_TEMPLATE,
  FETCH_FREE_SPINS_TEMPLATES,
};
const actionCreators = {
  addFreeSpinTemplate,
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
