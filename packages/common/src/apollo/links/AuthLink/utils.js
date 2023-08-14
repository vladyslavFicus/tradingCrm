/**
 * Check if response with UNAUTHENTICATED error
 *
 * @param result
 *
 * @return {*}
 */
const isUnauthenticatedError = result => result?.errors?.some(error => error?.extensions?.code === 'UNAUTHENTICATED');

/**
 * Set headers to operation
 *
 * @param operation
 * @param customHeaders
 */
const setHeaders = (operation, customHeaders) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...customHeaders,
    },
  }));
};

export {
  isUnauthenticatedError,
  setHeaders,
};
