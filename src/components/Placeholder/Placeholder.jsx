import React from 'react';
import PropTypes from 'prop-types';
import ReactPlaceholder from 'react-placeholder';

const Placeholder = ({ children, ...rest }) => (
  <ReactPlaceholder {...rest}>
    {children}
  </ReactPlaceholder>
);

Placeholder.propTypes = {
  ready: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
};

Placeholder.defaultProps = {
  children: null,
  ready: false,
  className: 'animated-background',
  color: '#F0F0F0',
};

export default Placeholder;
