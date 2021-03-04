import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation Click2Call_DidLogicCreateCall(
    $uuid: String!
    $field: String!
    $type: String!
  ) {
    clickToCall {
      didlogic {
        createCall(
          uuid: $uuid
          field: $field
          type: $type
        )
      }
    }
  }`;

const DidlogicCreateCall = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

DidlogicCreateCall.propTypes = {
  children: PropTypes.func.isRequired,
};

export default DidlogicCreateCall;
