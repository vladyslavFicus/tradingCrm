import { get } from 'lodash';
import * as Sentry from '@sentry/browser';
import { actionCreators as notificationActions } from '../modules/notifications';
import { getBrandId, getVersion } from '../../config';

const regExp = new RegExp('-failure$');

export default () => next => (action) => {
  const status = get(action, 'payload.status');

  if (
    action && action.error && regExp.test(action.type)
    && action.payload.response && [400, 401, 403, 404, 423].indexOf(status) === -1
    && (!action.payload.response.message || action.payload.response.message !== 'JWT_TOKEN_EXPIRED')
  ) {
    Sentry.captureMessage(`API error - ${action.type}`, {
      level: 'warning',
      extra: {
        action,
        brand: getBrandId(),
        version: getVersion(),
      },
    });
  }

  if (status === 403) {
    next(notificationActions.add({
      id: Math.round((new Date()).getTime() / 1000),
      message: 'COMMON.NOTIFICATIONS.PERMISSION_DENIED.MESSAGE',
      title: 'COMMON.NOTIFICATIONS.PERMISSION_DENIED.TITLE',
      level: 'error',
    }));
  }

  return next(action);
};
