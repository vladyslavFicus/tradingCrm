import { isValidRSAA } from 'redux-api-middleware';
import jwtDecode from 'jwt-decode';
import {
  actionCreators as authActionCreators,
} from '../../redux/modules/auth';
import timestamp from '../../utils/timestamp';

export default function ({ expireThreshold = 60 }) {
  let refreshing = false;

  return store => next => (action) => {
    if (!refreshing) {
      const { auth: { logged, token } } = store.getState();

      if (logged && token) {
        const tokenData = jwtDecode(token);

        if ((tokenData.exp - timestamp()) <= expireThreshold && isValidRSAA(action)) {
          console.info('[Token]: Start refreshing...');
          refreshing = true;

          return next(action)
            .then(responseAction => store
              .dispatch(authActionCreators.refreshToken())
              .then(() => {
                console.info('[Token]: Stop refreshing...');
                refreshing = false;

                return responseAction;
              })
            );
        }
      }
    }

    return next(action);
  };
}
