import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledTooltip } from '../Reactstrap/Uncontrolled';

const FailedStatusIcon = ({ id, children, showTimeout, hideTimeout, iconClassName }) => (
  <span className="failed-status-icon">
    <i id={id} className={iconClassName} />
    <UncontrolledTooltip
      placement="bottom"
      target={id}
      delay={{ show: showTimeout, hide: hideTimeout }}
    >
      {children}
    </UncontrolledTooltip>
  </span>
);
FailedStatusIcon.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  showTimeout: PropTypes.number,
  hideTimeout: PropTypes.number,
  iconClassName: PropTypes.string,
};
FailedStatusIcon.defaultProps = {
  iconClassName: 'transaction-failed-icon',
  showTimeout: 350,
  hideTimeout: 250,
};

export default FailedStatusIcon;
