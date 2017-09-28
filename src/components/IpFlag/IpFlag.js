import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const IpFlag = ({ id, country, ip }) => (
  <span>
    <i id={id} className={`fs-icon fs-${country.toLowerCase()} flag-icon`} />
    <UncontrolledTooltip
      placement="top"
      target={id}
      delay={{
        show: 350,
        hide: 250,
      }}
    >
      {ip}
    </UncontrolledTooltip>
  </span>
);

IpFlag.propTypes = {
  id: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
};


export default IpFlag;
