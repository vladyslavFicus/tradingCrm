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

  const errorCode = get(errorResponse, 'error', 'error.internal');
  const errorParameters = get(errorResponse, 'errorParameters', {});
  const errors = get(errorResponse, 'errors', []);

  return {
    error: errorCode,
    message: I18n.t(errorCode, { defaultValue: errorResponse?.message }),
    fields: Object.keys(fields).length ? fields : null,
    errorParameters,
    errors,
  };
};
