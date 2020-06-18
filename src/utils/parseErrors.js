import { get } from 'lodash';
import I18n from 'i18n-js';

export default (error) => {
  const errorResponse = get(error, 'graphQLErrors.0.extensions.response.body');
  const fieldsErrors = get(errorResponse, 'fields_errors', {});

  // Collect errors from { email: { error: 'some.error' } } object to { email: 'some.error' }
  const fields = Object.keys(fieldsErrors).reduce((acc, curr) => ({
    ...acc,
    [curr]: I18n.t(fieldsErrors[curr].error),
  }), {});

  return {
    error: get(errorResponse, 'error', 'error.internal'),
    message: I18n.t(get(errorResponse, 'error', 'error.internal')),
    fields: Object.keys(fields).length ? fields : null,
  };
};
