import { combineReducers } from 'redux';

import campaigns, {
  initialState as campaignsInitialState,
  actionTypes as campaignsActionTypes,
  actionCreators as campaignsActionCreators,
} from './campaigns';
import types, {
  initialState as typesInitialState,
  actionTypes as typesActionTypes,
  actionCreators as typesActionCreators,
} from './types';

const initialState = {
  campaigns: campaignsInitialState,
  types: typesInitialState,
};
const actionTypes = {
  ...campaignsActionTypes,
  ...typesActionTypes,
};
const actionCreators = {
  ...campaignsActionCreators,
  ...typesActionCreators,
  resetAll: () => (dispatch) => {
    dispatch(campaignsActionCreators.resetCampaigns());
  },
};

export {
  initialState,
  actionTypes,
  actionCreators,
};

export default combineReducers({
  campaigns,
  types,
});
