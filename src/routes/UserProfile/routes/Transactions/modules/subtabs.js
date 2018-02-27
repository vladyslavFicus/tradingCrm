import createReducer from '../../../../../utils/createReducer';
import { filterItems as filterAvailableItems } from '../../../../../utils/permissions';
import { routes as subTabRoutes } from '../constants';

const KEY = 'user-transactions-tab';
const INIT_SUB_TABS = `${KEY}/init-subtabs`;

function initSubTabs(userPermissions) {
  return {
    type: INIT_SUB_TABS,
    payload: userPermissions,
  };
}

const actionHandlers = {
  [INIT_SUB_TABS]: (state, { payload: userPermissions }) => ({
    ...state,
    tabs: filterAvailableItems(subTabRoutes, userPermissions),
  }),
};
const initialState = {
  tabs: [],
};

const actionTypes = {
  INIT_SUB_TABS,
};
const actionCreators = {
  initSubTabs,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
