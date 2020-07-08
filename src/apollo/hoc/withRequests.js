import React, { useState, useEffect } from 'react';
import deepMerge from 'deepmerge';

/**
 * Helper to extend query props with loadMore function
 *
 * @param fetchMore
 *
 * @return {function(*): *}
 */
const loadMore = ({ fetchMore }) => {
  let loading = false;

  return async (page) => {
    if (!loading) {
      loading = true;

      const variables = typeof page === 'number' ? { page } : page;

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
    const [pollActive, setPollActive] = useState(true);

    const pollControl = () => setPollActive(document.visibilityState === 'visible');

    useEffect(() => {
      document.addEventListener('visibilitychange', pollControl, false);
      return () => {
        document.removeEventListener('visibilitychange', pollControl);
      };
    }, []);

    const traverseRequests = (remainRequests, requestsProps = {}) => {
      if (remainRequests.length) {
        const [key, Request] = remainRequests[0];

        return (
          <Request {...props} pollActive={pollActive}>
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
