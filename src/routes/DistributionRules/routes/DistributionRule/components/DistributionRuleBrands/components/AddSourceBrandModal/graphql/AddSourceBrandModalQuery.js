import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Query } from '@apollo/client/react/components';

const REQUEST = gql`query AddSourceBrandModalQuery($brandId: String) {
  userBranches(brandId: $brandId) {
    DESK {
      name
      uuid
    }
    TEAM {
      name
      uuid
      parentBranch {
        uuid
      }
    }
  }
  partners(brandId: $brandId) {
    content {
      uuid
      fullName
      brand
    }
  }
}
`;

const AddSourceBrandModalQuery = ({ children, initialValues }) => (
  <Query
    query={REQUEST}
    fetchPolicy="cache-and-network"
    variables={{ brandId: initialValues?.brand }}
  >
    {children}
  </Query>
);

AddSourceBrandModalQuery.propTypes = {
  children: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
};

AddSourceBrandModalQuery.defaultProps = {
  initialValues: {},
};

export default AddSourceBrandModalQuery;
