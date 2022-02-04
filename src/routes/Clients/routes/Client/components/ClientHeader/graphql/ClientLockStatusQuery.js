import React from 'react';
import PropTypes from 'constants/propTypes';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query ClientHeader_ClientLockStatusQuery(
    $playerUUID: String!
  ) {
    loginLock(uuid: $playerUUID) {
      lock
    }
  }`;

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
