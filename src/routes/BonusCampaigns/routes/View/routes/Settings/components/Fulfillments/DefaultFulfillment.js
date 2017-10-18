import React from 'react';
import PropTypes from 'prop-types';

const DefaultFulfillment = ({ label, remove }) => (
  <div className="add-campaign-container">
    <div className="add-campaign-label">
      {label}
    </div>
    <button
      className="btn-transparent add-campaign-remove"
      type="button"
      onClick={remove}
    >
      &times;
    </button>
  </div>
);

DefaultFulfillment.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

DefaultFulfillment.defaultProps = {
  onClick: null,
};

export default DefaultFulfillment;
