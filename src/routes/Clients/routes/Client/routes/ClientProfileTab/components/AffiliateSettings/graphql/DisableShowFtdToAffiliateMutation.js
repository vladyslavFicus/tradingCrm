import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation AffiliateSettings__DisableShowFtdToAffiliateMutation(
    $profileUuid: String!
  ) {
    payment {
      disableShowFtdToAffiliate(
        profileUuid: $profileUuid
      )
    }
  }
`;

const DisableShowFtdToAffiliateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DisableShowFtdToAffiliateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DisableShowFtdToAffiliateMutation;
