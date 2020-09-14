import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const MUTATION = gql`
  mutation UpdateAcquisition(
    $uuid: String!
    $parentOperator: String
    $salesStatus: String
    $retentionStatus: String
  ) {
    hierarchy {
      updateAcquisition(
        uuid: $uuid
        parentOperator: $parentOperator
        salesStatus: $salesStatus
        retentionStatus: $retentionStatus
      )
    }
  }
`;

const UpdateAcquisition = ({ children }) => (
  <Mutation mutation={MUTATION}>{children}</Mutation>
);

UpdateAcquisition.propTypes = {
  children: PropTypes.func.isRequired,
};

export default UpdateAcquisition;
