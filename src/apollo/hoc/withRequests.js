import React from 'react';
import deepMerge from 'deepmerge';

/**
 * Helper to extend query props with loadMore function
 *
 * @param fetchMore
 * @param variables
 *
 * @return {function(*): *} Function which takes only one argument and this argument can be a:
 *
 * 1. Function with variables arguments to use it in load more
 * 2. Number to override variables.page only
 * 3. Object to override all variables
 */
const loadMore = ({ fetchMore, variables: prevVariables }) => {
  let loading = false;

  return async (arg) => {
    if (!loading) {
      loading = true;

      let variables = {};

      switch (typeof arg) {
        case 'function':
          // Should provide new object to disable modifying existing one
          // because Apollo Client doesn't work with mutable variables object
          variables = arg(deepMerge({}, prevVariables));
          break;
        case 'number':
          variables = { page: arg };
          break;
        default:
          variables = arg;
      }

      await fetchMore({
        variables,
        updateQuery: (prev, { fetchMoreResult }) => deepMerge(prev, fetchMoreResult),
      });

      loading = false;
    }
  };
};

/**
 * HOC to use queries and mutations inside components
 *
 * Example:
 *
 * export default withRequests({ options: OptionsQuery, signIn: SignInMutation })(Component);
 *
 * It returns react tree as:
 *
 *  <OptionsQuery>
 *    {(options) => (
 *      <SignInMutation>
 *        {(signIn) => (
 *          <Component {...props} options={options} signIn={signIn} />
 *        )}
 *      </SignInMutation>
 *    )}
 *  </OptionsQuery>
 *
 * @param requests {Object} Example: { options: OptionsQuery, signUp: SignUpMutation }
 *
 * @return {*}
 */
export default requests => (Component) => {
  // Generate memoized request components on fly to prevent query or mutation re-render when parent re-rendered
  const memoizedRequests = Object.keys(requests).map(key => [key, React.memo(requests[key])]);

  const WrappedComponent = (props) => {
    const traverseRequests = (remainRequests, requestsProps = {}) => {
      if (remainRequests.length) {
        const [key, Request] = remainRequests[0];

        return (
          <Request {...props}>
            {(requestProp) => {
              // If request is query --> add loadMore function
              if (requestProp.data) {
                requestProp.loadMore = loadMore(requestProp); // eslint-disable-line
              }

              return traverseRequests(remainRequests.slice(1), { ...requestsProps, [key]: requestProp });
            }}
          </Request>
        );
      }

      return <Component {...props} {...requestsProps} />;
    };

    return traverseRequests(memoizedRequests);
  };

  WrappedComponent.displayName = `withRequests(${(Component.displayName || Component.name)})`;

  return React.memo(WrappedComponent);
};
