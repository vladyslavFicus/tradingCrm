import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`
  query profile($playerUUID: String!){
    profile(playerUUID: $playerUUID) {
      data {
        uuid
        firstName
        lastName
        birthDate
        profileView {
          balance {
            amount
            credit
          }
        }
      }
      error {
        error
      }
    }
  }
`;

const getProfileQuery = ({
  children,
  payment: {
    playerProfile: {
      uuid,
    },
  },
}) => (
  <Query
    query={REQUEST}
    variables={{ playerUUID: uuid }}
    fetchPolicy="network-only"
  >
    {children}
  </Query>
);

getProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
  payment: PropTypes.shape({
    playerProfile: PropTypes.shape({
      uuid: PropTypes.string,
    }),
  }).isRequired,
};

export default getProfileQuery;
