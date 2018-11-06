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

import depositNumbers, {
  initialState as depositNumbersInitialState,
  actionTypes as depositNumbersActionTypes,
  actionCreators as depositNumbersActionCreators,
} from './depositNumbers';

const initialState = {
  campaigns: campaignsInitialState,
  types: typesInitialState,
  depositNumbers: depositNumbersInitialState,
};
const actionTypes = {
  ...campaignsActionTypes,
  ...typesActionTypes,
  ...depositNumbersActionTypes,
};
const actionCreators = {
  ...campaignsActionCreators,
  ...typesActionCreators,
  ...depositNumbersActionCreators,
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
  depositNumbers,
});
