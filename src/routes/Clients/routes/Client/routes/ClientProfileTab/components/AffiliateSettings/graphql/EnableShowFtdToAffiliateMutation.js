import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation AffiliateSettings__EnableShowFtdToAffiliateMutation(
    $profileUuid: String!
  ) {
    payment {
      enableShowFtdToAffiliate(
        profileUuid: $profileUuid
      )
    }
  }
`;

const EnableShowFtdToAffiliateMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

EnableShowFtdToAffiliateMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default EnableShowFtdToAffiliateMutation;
