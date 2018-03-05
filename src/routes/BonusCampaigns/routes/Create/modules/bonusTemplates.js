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
const createBonusTemplate = bonusTemplatesActionCreators.createBonusTemplate(CREATE_BONUS_TEMPLATE);

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
