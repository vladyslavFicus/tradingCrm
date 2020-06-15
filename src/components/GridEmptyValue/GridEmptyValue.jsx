import React from 'react';
import PropTypes from 'prop-types';

const GridEmptyValue = ({ I18n }) => (
  <span className="grid-empty-value">{I18n.t('COMMON.NONE')}</span>
);

GridEmptyValue.propTypes = {
  I18n: PropTypes.object.isRequired,
};

export default GridEmptyValue;
