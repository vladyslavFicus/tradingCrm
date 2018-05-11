import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import {
  sourceActionCreators as freeSpinTemplatesActionCreators,
} from '../../../../../../../redux/modules/campaigns/freeSpinTemplates';

const KEY = 'bonus-campaign/view/settings';
const FETCH_FREE_SPINS_TEMPLATES = createRequestAction(`${KEY}/fetch-free-spin-templates`);
const FETCH_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/fetch-free-spin-template`);
const CREATE_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/create-free-spin-template`);
const ASSIGN_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/assign-free-spin-template`);

const fetchFreeSpinTemplates = freeSpinTemplatesActionCreators.fetchFreeSpinTemplates(FETCH_FREE_SPINS_TEMPLATES);
const fetchFreeSpinTemplate = freeSpinTemplatesActionCreators.fetchFreeSpinTemplate(FETCH_FREE_SPINS_TEMPLATE);
const createFreeSpinTemplate = freeSpinTemplatesActionCreators.createFreeSpinTemplate(CREATE_FREE_SPINS_TEMPLATE);
const assignFreeSpinTemplate = freeSpinTemplatesActionCreators.assignFreeSpinTemplate(ASSIGN_FREE_SPINS_TEMPLATE);

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
      aggregatorId: i.aggregatorId,
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
  FETCH_FREE_SPINS_TEMPLATES,
  FETCH_FREE_SPINS_TEMPLATE,
};
const actionCreators = {
  fetchFreeSpinTemplates,
  fetchFreeSpinTemplate,
  createFreeSpinTemplate,
  assignFreeSpinTemplate,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);