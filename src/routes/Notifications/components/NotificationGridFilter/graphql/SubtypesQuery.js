import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const REQUEST = gql`query NotificationGridFilter_SubtypesQuery {
  notificationCenterSubtypes {
    data
    error {
      error
      fields_errors
    }
  }
}`;

const SubtypesQuery = ({ children }) => (
  <Query query={REQUEST}>
    {children}
  </Query>
);

SubtypesQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default SubtypesQuery;
