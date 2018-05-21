import React from 'react';
import PropTypes from 'prop-types';

const PlayerLimitButton = ({
  label, canUnlock, className, onClick,
}) => (
  <button type="button" className={className} onClick={onClick}>
    {canUnlock ? 'Unlock' : 'Lock'} {label}
  </button>
);
PlayerLimitButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  canUnlock: PropTypes.bool,
};
PlayerLimitButton.defaultProps = {
  className: '',
  canUnlock: false,
};

export default PlayerLimitButton;
