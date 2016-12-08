import jwtDecode from 'jwt-decode';
import {
  actionTypes as authActionTypes,
  actionCreators as authActionCreators
} from 'redux/modules/auth';

const timestamp = () => Date.now() / 1000;

class Timer {
  timeout = null;
  delayed = false;

  start(func, delay) {
    this.delayed = true;
    setTimeout(() => {
      this.stop();
      func();
    }, delay * 1000);
  }

  stop() {
    if (this.timeout !== null) {
      clearInterval(this.timeout);
      this.timeout = null;
      this.delayed = false;
    }
  }

  isDelayed() {
    return this.delayed;
  }
}

const allowedTypes = [authActionTypes.REFRESH_TOKEN.SUCCESS, authActionTypes.SIGN_IN.SUCCESS];
const EXPIRE_TIME_OFFSET = 60;

export default function () {
  const timer = new Timer();
  let initializationRefresh = false;

  const scheduleRefreshToken = (dispatch, token) => {
    if (!token) {
      return false;
    }

    timer.stop();

    const data = jwtDecode(token);
    const timeout = (data.exp - timestamp()) - EXPIRE_TIME_OFFSET;

    console.info('Token will be refresh in: ', parseFloat(timeout).toFixed(2));
    timer.start(() => {
      console.info('Token refresh started');
      dispatch(authActionCreators.refreshToken());
    }, timeout);

    return true;
  };

  return ({ dispatch, getState }) => next => action => {
    if (!action) {
      return next(action);
    }

    let token = null;
    if (!timer.isDelayed() && !initializationRefresh) {
      initializationRefresh = true;
      token = getState().auth.token;
    } else if (allowedTypes.indexOf(action.type) > -1) {
      console.info('Trying to schedule token refresh.');
      token = action.type === authActionTypes.REFRESH_TOKEN.SUCCESS ?
        action.payload.jwtToken : action.payload.token;
    }

    if (token) {
      scheduleRefreshToken(dispatch, token);
    }

    return next(action);
  };
};
