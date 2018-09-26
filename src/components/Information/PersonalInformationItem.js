import React from 'react';
import PropTypes from 'prop-types';

const PersonalInformationItem = ({
  label,
  value,
  verified,
  className,
}) => {
  if (!value) {
    return null;
  }

  return (
    <div className={className}>
      <strong>{label}</strong>: {value}
      {' '}
      {verified && <i className="fa fa-check text-success" />}
    </div>
  );
};

PersonalInformationItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  verified: PropTypes.bool,
  className: PropTypes.string,
};

PersonalInformationItem.defaultProps = {
  value: null,
  verified: false,
  className: '',
};

export default PersonalInformationItem;
