import React from 'react';
import PropTypes from 'prop-types';
import ShortLoader from '../ShortLoader';

const GridViewLoader = ({ className, colSpan }) => (
  <tr className={className}>
    <td colSpan={colSpan}>
      <ShortLoader />
    </td>
  </tr>
);

GridViewLoader.propTypes = {
  className: PropTypes.string,
  colSpan: PropTypes.number.isRequired,
};
GridViewLoader.defaultProps = {
  className: null,
};

export default GridViewLoader;
