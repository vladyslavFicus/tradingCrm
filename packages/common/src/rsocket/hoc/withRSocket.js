import React from 'react';
import PropTypes from 'prop-types';
import { RSocketConsumer } from '../providers/RSocketProvider';

/**
 * withRSocket HOC to provide rsocket object to make requests
 *
 * Example:
 *
 * Provide `rsocket` object in component props:
 *
 * export default withRSocket(SignIn);
 *
 * @param Component
 *
 * @return {*}
 */
const withRSocket = (Component) => {
  const WrappedComponent = props => (
    <RSocketConsumer>
      {rsocket => <Component {...props} rsocket={rsocket} />}
    </RSocketConsumer>
  );

  WrappedComponent.displayName = `withRSocket(${(Component.displayName || Component.name)})`;

  return WrappedComponent;
};

withRSocket.propTypes = {
  rsocket: PropTypes.shape({}).isRequired,
};

export default withRSocket;
