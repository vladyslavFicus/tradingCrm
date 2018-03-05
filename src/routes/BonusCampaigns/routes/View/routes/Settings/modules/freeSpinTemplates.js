import createReducer from '../../../../../../../utils/createReducer';
import createRequestAction from '../../../../../../../utils/createRequestAction';
import {
  sourceActionCreators as freeSpinTemplatesActionCreators,
} from '../../../../../../../redux/modules/freeSpinTemplates';

const KEY = 'bonus-campaign/view/settings';
const CREATE_FREE_SPIN_TEMPLATE = createRequestAction(`${KEY}/create-free-spin-template`);
const FETCH_FREE_SPINS_TEMPLATES = createRequestAction(`${KEY}/fetch-free-spin-templates`);
const FETCH_FREE_SPINS_TEMPLATE = createRequestAction(`${KEY}/fetch-free-spin-template`);

const fetchFreeSpinTemplates = freeSpinTemplatesActionCreators.fetchFreeSpinTemplates(FETCH_FREE_SPINS_TEMPLATES);
const fetchFreeSpinTemplate = freeSpinTemplatesActionCreators.fetchFreeSpinTemplate(FETCH_FREE_SPINS_TEMPLATE);
const createFreeSpinTemplate = freeSpinTemplatesActionCreators.createFreeSpinTemplate(CREATE_FREE_SPIN_TEMPLATE);

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
