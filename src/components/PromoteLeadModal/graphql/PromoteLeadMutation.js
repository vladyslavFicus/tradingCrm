import React from 'react';
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/client/react/components';

const REQUEST = gql`
  mutation PromoteLeadModal_PromoteLeadMutation(
    $args: PromoteLead__Input
  ) {
    leads {
      promote(args: $args)
    }
  }
`;

const PromoteLeadMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

PromoteLeadMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PromoteLeadMutation;
