import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import { getBrand } from 'config';

const REQUEST = gql`query LeadsGridFilter_AcquisitionStatusesQuery($brandId: String!) {
  settings {
    salesStatuses: acquisitionStatuses(brandId: $brandId, args: { type: SALES }) {
      status
    }
  }
}
`;

const AcquisitionStatusesQuery = ({ children }) => (
  <Query query={REQUEST} variables={{ brandId: getBrand().id }} fetchPolicy="cache-and-network">
    {children}
  </Query>
);

AcquisitionStatusesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AcquisitionStatusesQuery;
