import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { ProfileStatusFragment } from 'graphql/fragments/profileStatus';


const REQUEST = gql`  
  mutation changeProfileStatus_PlayerStatusModal(
    $playerUUID: String!,
    $reason: String!,
    $comment: String,
    $status: String!,
  ) {
    profile {
      changeProfileStatus(
        playerUUID: $playerUUID,
        reason: $reason,
        comment: $comment,
        status: $status,
      ) {
        data {
          _id
          status {
            ...ProfileStatusFragment
          }
        }
        error {
          error
          fields_errors
        }
      }
    }
  }
${ProfileStatusFragment}`;


const ChangeProfileStatusMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);


ChangeProfileStatusMutation.propTypes = {
  children: PropTypes.func.isRequired,
};


export default ChangeProfileStatusMutation;
