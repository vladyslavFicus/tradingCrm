import React from 'react';
import PropTypes from 'prop-types';

const GridViewColumn = ({ children }) => (
  <td>{children}</td>
);

GridViewColumn.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string,
  headerClassName: PropTypes.string,
  headerStyle: PropTypes.object,
  render: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
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
