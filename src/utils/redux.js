/**
 * Create action types object
 * @constructor
 * @param {string} base - Base key.
 *
 * @return {Object}
 */
export function createRequestTypes(base) {
  return ['REQUEST', 'SUCCESS', 'FAILURE'].reduce((acc, type) => {
    acc[type] = `${base}-${type.toLowerCase()}`;
    return acc;
  }, {});
}

export function createAction(type, payload = {}) {
  return { type, ...payload };
}

export function createReducer(handlers, initialState, _state, _action) {
  return ((state = initialState, action) => {
    const handler = handlers[action.type];

    return handler ? handler(state, action) : state;
  })(_state, _action);
}
