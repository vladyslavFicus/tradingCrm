import createReducer from '../../../../../utils/createReducer';
import { type, gameProvider, withLines } from '../../../../../constants/games';

const initialState = {
  data: {
    withLines,
    type,
    gameProvider,
  },
  error: null,
  isLoading: false,
  receivedAt: null,
};
const actionHandlers = {};
const actionTypes = {};
const actionCreators = {};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
