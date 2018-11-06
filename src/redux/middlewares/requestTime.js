import timestamp from '../../utils/timestamp';

const regExp = new RegExp('-(success|failure)$');

export default () => next => (action) => {
  if (regExp.test(action.type)) {
    return next({ ...action, meta: { ...action.meta, endRequestTime: timestamp() } });
  }

  return next({ ...action, meta: { ...action.meta, startRequestTime: timestamp() } });
};
