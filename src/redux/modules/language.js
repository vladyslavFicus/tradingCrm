import moment from 'moment';
import Validator from 'validatorjs';
import { SET_LOCALE } from 'react-redux-i18n';
import createReducer from '../../utils/createReducer';

function setLocale(language) {
  Validator.useLang(language);
  moment.locale(language === 'zh' ? 'zh-cn' : language);

  return {
    type: SET_LOCALE,
    locale: language,
  };
}

const initialState = null;
const actionHandlers = {
  [SET_LOCALE]: (state, action) => action.locale,
};

const actionTypes = {};
const actionCreators = {
  setLocale,
};

export {
  initialState,
  actionTypes,
  actionCreators,
  actionHandlers,
};

export default createReducer(initialState, actionHandlers);
