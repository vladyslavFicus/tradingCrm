import { get } from 'lodash';
import deepMerge from 'deepmerge';

/**
 * Paginate results depends on changed offset by field key
 *
 * @param offsetFieldPath Path to offset field which should one should be changed to merge previous and current results
 *
 * @return {{keyArgs: boolean, merge(*, *, *): (unknown)}}
 */
export default offsetFieldPath => ({
  keyArgs: ['@connection', ['key']],
  merge(existing, incoming, options) {
    // If pagination offset not equal 0 --> then merge previous result with current
    if (get(options.args, offsetFieldPath, 0) !== 0) {
      return deepMerge(existing, incoming);
    }

    // Just return overrided result
    return incoming;
  },
});
