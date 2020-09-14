import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation promoteLead($args: PromoteLead__Input) {
    leads {
      promote(args: $args) {
        uuid
      }
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
