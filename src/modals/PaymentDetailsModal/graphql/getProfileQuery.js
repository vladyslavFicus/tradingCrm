import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query profile($playerUUID: String!){
    profile(playerUUID: $playerUUID) {
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
