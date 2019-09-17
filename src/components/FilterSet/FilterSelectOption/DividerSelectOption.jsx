import React from 'react';
import classNames from 'classnames';
import PropTypes from 'constants/propTypes';

const DividerSelectOption = ({ fullWidth }) => (
  <hr
    className={classNames(
      'filter-set-divider',
      { 'with-margin': !fullWidth },
    )}
  />
);

DividerSelectOption.propTypes = {
  fullWidth: PropTypes.bool,
};

DividerSelectOption.defaultProps = {
  fullWidth: false,
};

export default React.memo(DividerSelectOption);
