import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { get } from 'lodash';
import { servicesQuery } from '../../graphql/queries/options';

export default function withServiceCheck(WrappedComponent) {
  const WithServiceCheck = ({ optionServices, ...props }) => (
    <WrappedComponent
      {...props}
      checkService={service => get(optionServices, 'options.services', []).includes(service)}
    />
  );

  WithServiceCheck.propTypes = {
    optionServices: PropTypes.shape({
      options: PropTypes.shape({
        services: PropTypes.arrayOf(PropTypes.string),
      }),
    }),
  };

  WithServiceCheck.defaultProps = {
    optionServices: {},
  };

  return graphql(servicesQuery, {
    name: 'optionServices',
    options: {
      fetchPolicy: 'network-only',
    },
  })(WithServiceCheck);
}
