import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation Click2Call_CommpeakCreateCall(
    $uuid: String!
    $field: String!
    $type: String!
    $prefix: String!
  ) {
    clickToCall {
      commpeak {
        createCall(
          uuid: $uuid
          field: $field
          type: $type
          prefix: $prefix
        )
      }
    }
  }`;

const CommpeakCreateCall = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

CommpeakCreateCall.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CommpeakCreateCall;
