import createReducer from '../../../utils/createReducer';
import Permissions from '../../../utils/permissions';

const KEY = 'user-transactions-tab';
const INIT_SUB_TABS = `${KEY}/init-subtabs`;

function initSubTabs(userPermissions, routes) {
  return {
    type: INIT_SUB_TABS,
    payload: {
      userPermissions,
      routes,
    },
  };
}

const actionHandlers = {
  [INIT_SUB_TABS]: (state, { payload: { userPermissions, routes } }) => ({
    ...state,
    tabs: routes.filter(
      i => !(i.permissions instanceof Permissions) || i.permissions.check(userPermissions)
    ),
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
