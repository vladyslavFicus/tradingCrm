import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ children }) => <div className="card-heading">{children}</div>;

Title.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Title;
