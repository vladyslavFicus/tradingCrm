import React from 'react';
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

      await fetchMore({
        variables: { page },
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

    return traverseRequests(Object.entries(requests));
  };

  WrappedComponent.displayName = `withRequests(${(Component.displayName || Component.name)})`;

  return WrappedComponent;
};
