import React from 'react';

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
            {requestProp => traverseRequests(remainRequests.slice(1), { ...requestsProps, [key]: requestProp })}
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
