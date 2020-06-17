import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query ProfileQuery($playerUUID: String!) {
    profile(playerUUID: $playerUUID) {
      data {
        _id
        uuid
        tradingAccount {
          accountUUID
          accountType
          archived
          balance
          credit
          currency
          group
          login
          margin
          name
          platformType
        }
      }
    }
  }
`;

const ProfileQuery = ({
  children,
  match: {
    params: { id: playerUUID },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{
      playerUUID,
    }}
  >
    {children}
  </Query>
);

ProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default ProfileQuery;
