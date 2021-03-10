import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const REQUEST = gql`
  mutation TrackifyMutation($args: [Analytics__Input]) {
    analytics {
      track(args: $args)
    }
  }
`;

const TrackifyMutation = ({ children }) => (
  <Mutation mutation={REQUEST}>
    {children}
  </Mutation>
);

TrackifyMutation.propTypes = {
  children: PropTypes.func.isRequired,
};

export default TrackifyMutation;
