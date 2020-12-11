import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query PartnersQuery {
  partners {
    content {
      uuid
      fullName
    }
  }
}`;

const PartnersQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

PartnersQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PartnersQuery;
