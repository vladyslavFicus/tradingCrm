import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation AffiliateSettings__EnableShowFtdToAffiliateMutation(
    $showFtdToAffiliate: Boolean!
    $profileUuid: String!
  ) {
    payment {
      enableShowFtdToAffiliate(
        showFtdToAffiliate: $showFtdToAffiliate
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
