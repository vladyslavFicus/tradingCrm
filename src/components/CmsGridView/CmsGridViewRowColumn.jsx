import React from 'react';
import PropTypes from 'prop-types';
import { getGridColumn } from './utils';

const CmsGridViewRowColumn = ({ column, data }) => {
  const gridColumn = getGridColumn(column);
  let content = null;

  if (typeof gridColumn.render === 'function') {
    content = gridColumn.render.call(null, data, gridColumn);
  } else if (typeof gridColumn.name === 'string') {
    content = data[gridColumn.name];
  }

  return <td className={gridColumn.className}>{content}</td>;
};

CmsGridViewRowColumn.propTypes = {
  column: PropTypes.element.isRequired,
  data: PropTypes.object.isRequired,
};

export default CmsGridViewRowColumn;
