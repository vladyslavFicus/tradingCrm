import React from 'react';
import I18n from 'i18n-js';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NotificationDetailsItem = ({
  label,
  value,
  className,
}) => (
  <div className={className}>
    <strong>{label}</strong>:
    <span className={classNames('font-weight-700 float-right', value ? 'color-success' : 'color-danger')}>
      {I18n.t(`COMMON.${value ? 'ENABLED' : 'DISABLED'}`)}
    </span>
  </div>
);

NotificationDetailsItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool,
  className: PropTypes.string,
};

NotificationDetailsItem.defaultProps = {
  value: null,
  className: '',
};

export default NotificationDetailsItem;
