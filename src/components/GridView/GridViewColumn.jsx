import React from 'react';
import PropTypes from 'prop-types';

const GridViewColumn = ({ children }) => (
  <td>{children}</td>
);

GridViewColumn.propTypes = {
  name: PropTypes.string.isRequired, // eslint-disable-line
  header: PropTypes.string, // eslint-disable-line
  headerClassName: PropTypes.string, // eslint-disable-line
  headerStyle: PropTypes.object, // eslint-disable-line
  render: PropTypes.func, // eslint-disable-line
  className: PropTypes.string, // eslint-disable-line
  style: PropTypes.object, // eslint-disable-line
  children: PropTypes.any,
};

GridViewColumn.defaultProps = {
  header: null,
  headerClassName: null,
  headerStyle: null,
  render: null,
  className: null,
  style: null,
  children: null,
};

export default GridViewColumn;
