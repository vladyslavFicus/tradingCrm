import React from 'react';
import PropTypes from 'constants/propTypes';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query LoginLockQuery(
    $playerUUID: String!
  ) {
    loginLock(uuid: $playerUUID) {
      lock
    }
  }`;

const LoginLockQuery = ({ children, profile: { uuid } }) => (
  <Query query={REQUEST} variables={{ playerUUID: uuid }}>
    {children}
  </Query>
);

LoginLockQuery.propTypes = {
  children: PropTypes.func.isRequired,
  profile: PropTypes.profile.isRequired,
};

export default LoginLockQuery;
