import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation clickToCall($number: String!) {
    profile {
      clickToCall(number: $number) {
        success
      }
    }
  }
`;

const ClickToCallMutation = ({ children }) => (
  <Mutation mutation={MUTATION}>
    {children}
  </Mutation>
);

ClickToCallMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ClickToCallMutation;
