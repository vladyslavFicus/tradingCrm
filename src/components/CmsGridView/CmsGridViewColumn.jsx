import React from 'react';
import PropTypes from 'prop-types';

const CmsGridViewColumn = ({ children }) => (
  <td>{children}</td>
);

CmsGridViewColumn.propTypes = {
  name: PropTypes.string.isRequired,
  header: PropTypes.string,
  headerClassName: PropTypes.string,
  headerStyle: PropTypes.object,
  render: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.any,
};
CmsGridViewColumn.defaultProps = {
  header: null,
  headerClassName: null,
  headerStyle: null,
  render: null,
  className: null,
  style: null,
  children: null,
};

export default CmsGridViewColumn;
