import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`
  query ClientHeader_ClientLockStatusQuery(
    $playerUUID: String!
  ) {
    loginLock(uuid: $playerUUID) {
      isLocked
      locks {
        lockReason
      }
    }
  }
`;

const ClientLockStatusQuery = ({ children, client }) => (
  <Query query={REQUEST} variables={{ playerUUID: client.uuid }}>
    {children}
  </Query>
);

ClientLockStatusQuery.propTypes = {
  children: PropTypes.func.isRequired,
  client: PropTypes.profile.isRequired,
};

export default ClientLockStatusQuery;
