import React from 'react';
import PropTypes from 'prop-types';

const PersonalInformationItem = ({
  label,
  value,
  verified,
  className,
  withCall,
  onClickToCall,
}) => (
  <If condition={value}>
    <div className={className}>
      <strong>{label}</strong>: {value}
      {' '}
      {verified && <i className="fa fa-check text-success" />}
      <If condition={withCall}>
        <span onClick={onClickToCall} className="font-weight-700 text-success font-size-24 cursor-pointer">
          &#9743;
        </span>
      </If>
    </div>
  </If>
);

PersonalInformationItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  verified: PropTypes.bool,
  className: PropTypes.string,
  withCall: PropTypes.bool,
  onClickToCall: PropTypes.func,
};

PersonalInformationItem.defaultProps = {
  value: null,
  verified: false,
  className: '',
  withCall: false,
  onClickToCall: () => {},
};

export default PersonalInformationItem;
