import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation Click2Call_AsteriskCreateCall(
    $uuid: String!
    $field: String!
    $type: String!
    $prefix: Int!
  ) {
    clickToCall {
      asterisk {
        createCall(
          uuid: $uuid
          field: $field
          type: $type
          prefix: $prefix
        )
      }
    }
  }`;

const AsteriskCreateCall = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

AsteriskCreateCall.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AsteriskCreateCall;
