import createReducer from '../../utils/createReducer';
import { actionTypes as userPanelActionTypes } from './user-panels';
import { actionTypes as windowActionTypes } from './window';

const KEY = 'app';
const TOGGLE_SCROLL_TO_TOP = `${KEY}/toggle_scroll_to_top`;

const initialState = {
  showScrollToTop: false,
};

function setIsShowScrollTop(isShow) {
  return {
    type: TOGGLE_SCROLL_TO_TOP,
    payload: isShow,
  };
}

const actionCreators = {
  setIsShowScrollTop,
};

const actionTypes = {
  TOGGLE_SCROLL_TO_TOP,
};

const actionHandlers = {
  [TOGGLE_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
  }),
  [userPanelActionTypes.SET_ACTIVE]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload !== null ? false : (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100),
  }),
  [windowActionTypes.SHOW_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
  }),
};

export {
  actionCreators,
  actionHandlers,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
