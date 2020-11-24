import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { ProfileStatusFragment } from 'graphql/fragments/profileStatus';


const REQUEST = gql`  
  mutation changeProfileStatus_PlayerStatusModal(
    $playerUUID: String!
    $reason: String!
    $comment: String
    $status: String!
  ) {
    profile {
      changeProfileStatus(
        playerUUID: $playerUUID
        reason: $reason
        comment: $comment
        status: $status
      ) {
        _id
        status {
          ...ProfileStatusFragment
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
