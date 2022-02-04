import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`
  query ChangePaymentStatusForm_getManualPaymentMethods {
    manualPaymentMethods
  }
`;

const getManualPaymentMethodsQuery = ({ children }) => (
  <Query query={REQUEST} fetchPolicy="network-only">
    {children}
  </Query>
);

getManualPaymentMethodsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default getManualPaymentMethodsQuery;
