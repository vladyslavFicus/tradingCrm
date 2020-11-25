import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation PartnerHeader_unlockPartnerLoginMutation(
    $uuid: String!
  ) {
    auth {
      unlockLogin(uuid: $uuid)
    }
  }
`;

const unlockPartnerLoginMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

unlockPartnerLoginMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default unlockPartnerLoginMutation;
