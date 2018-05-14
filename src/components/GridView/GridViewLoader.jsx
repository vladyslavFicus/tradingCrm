import React from 'react';
import PropTypes from 'prop-types';

const GridViewLoader = ({ className, colSpan }) => (
  <tr className={className}>
    <td colSpan={colSpan}>
      <img src="/img/infinite_preloader.svg" alt="preloader" />
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
