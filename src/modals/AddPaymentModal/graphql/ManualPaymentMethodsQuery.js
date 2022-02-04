import React from 'react';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import PropTypes from 'constants/propTypes';

const REQUEST = gql`query ManualPaymentMethodsQuery {
  manualPaymentMethods
}`;

const ManualPaymentMethodsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

ManualPaymentMethodsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ManualPaymentMethodsQuery;
