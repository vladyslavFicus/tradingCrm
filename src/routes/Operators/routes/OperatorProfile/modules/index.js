import { combineReducers } from 'redux';

import view, {
  initialState as viewInitialState,
} from './view';

const initialState = {
  view: viewInitialState,
};

export {
  initialState,
};

export default combineReducers({
  view,
});
