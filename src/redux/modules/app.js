import createReducer from '../../utils/createReducer';
import { actionTypes as windowActionTypes } from './window';

const KEY = 'app';
const SET_SCROLL_TO_TOP = `${KEY}/set-scroll-to-top`;

const initialState = {
  showScrollToTop: false,
  isInitializedScroll: false,
};

function setIsShowScrollTop(payload) {
  return {
    type: SET_SCROLL_TO_TOP,
    payload,
  };
}

const actionCreators = {
  setIsShowScrollTop,
};

const actionTypes = {
  SET_SCROLL_TO_TOP,
};

const actionHandlers = {
  [SET_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
    isInitializedScroll: state.isInitializedScroll || action.payload,
  }),
  [windowActionTypes.SHOW_SCROLL_TO_TOP]: (state, action) => ({
    ...state,
    showScrollToTop: action.payload,
    isInitializedScroll: state.isInitializedScroll || action.payload,
  }),
};

export {
  actionCreators,
  actionHandlers,
  actionTypes,
};

export default createReducer(initialState, actionHandlers);
