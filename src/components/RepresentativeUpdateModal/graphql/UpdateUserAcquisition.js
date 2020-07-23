import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation UpdateUserAcquisition(
    $salesRepresentative: String
    $retentionRepresentative: String
    $salesStatus: String
    $retentionStatus: String
    $type: String!
    $isMoveAction: Boolean
    $uuid: String!
  ) {
    hierarchy {
      updateUserAcquisition(
        salesRepresentative: $salesRepresentative
        retentionRepresentative: $retentionRepresentative
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
        type: $type
        isMoveAction: $isMoveAction
        uuid: $uuid
      )
    }
  }
`;

const UpdateUserAcquisition = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

UpdateUserAcquisition.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateUserAcquisition;
