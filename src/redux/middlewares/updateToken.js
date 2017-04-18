import { isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import {
  actionCreators as authActionCreators,
} from '../../redux/modules/auth';
import timestamp from '../../utils/timestamp';

const state = {
  pending: false,
};
export default function ({ expireThreshold = 60 }) {
  return store => next => async (action) => {
    if (!state.pending) {
      const { auth: { logged, token } } = store.getState();

      if (logged && token) {
        const tokenData = jwtDecode(token);

        if ((tokenData.exp - timestamp()) <= expireThreshold && isValidRSAA(action)) {
          console.info('[Token]: Start refreshing...', tokenData.exp - timestamp(), expireThreshold);
          state.pending = true;

          const responseAction = await next(action);
          await store.dispatch(authActionCreators.refreshToken());
          console.info('[Token]: Stop refreshing...');
          state.pending = false;

          return responseAction;
        }
      }
    }

    return next(action);
  };
}
