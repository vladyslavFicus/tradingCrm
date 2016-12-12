import GraylogClient, { methods } from 'nas-graylog-api';

const CALL_GRAYLOG = Symbol('CALL_GRAYLOG');
const hash = (...chunks) => btoa(chunks.join(':'));
const isValidAction = action => {
  return action && typeof action.method === 'string' && methods[action.method]
    && !!action.parameters && typeof action.parameters === 'object'
    && typeof Array.isArray(action.types) && action.types.length === 3;
};

const isValidConfig = (config) => config.host;
/*&& config.username && config.password*/

export { CALL_GRAYLOG };

export default config => {
  if (!isValidConfig(config)) {
    throw new Error('Invalid graylog middleware config');
  }

  const { username, password, host, port, basePath } = config;

  let input = null;
  const client = new GraylogClient({
    auth: 'Basic ' + hash(username || 'admin', password || 'admin'),
    port: port || 80,
    basePath: basePath || '/api',
    host,
  });

  client.getInputs()
    .then(response => {
      input = response.inputs.find(item => item.title === 'GAME EVENTS') || null;
    });

  return store => next => action => {
    if (!action) {
      return next(action);
    }

    const graylogAction = action[CALL_GRAYLOG];
    if (!graylogAction) {
      return next(action);
    }

    if (!isValidAction(graylogAction)) {
      throw new Error('Invalid graylog action');
    }

    if (!input) {
      throw new Error('Can\'t find input with logs');
    }

    const [requestType, successType, failureType] = graylogAction.types;
    if (typeof requestType === 'object') {
      next(requestType);
    } else {
      next({ type: requestType });
    }

    if (graylogAction.parameters.query) {
      graylogAction.parameters.query = `gl2_source_input:${input.id} AND ${graylogAction.parameters.query}`;
    }

    return client[graylogAction.method](graylogAction.parameters)
      .then(
        response => next({ type: successType, payload: response }),
        error => next({ type: failureType, error: true, payload: error })
      );
  };
};
