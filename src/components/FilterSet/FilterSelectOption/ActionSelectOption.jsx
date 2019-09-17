import React from 'react';
import PropTypes from 'constants/propTypes';

const ActionSelectOption = ({ data = {} }) => {
  const handleActionClick = () => {
    if (data.onClick) {
      data.onClick();
    }
  };

  return (
    <div className={`action-select-option ${data.iconClassName}`} onClick={handleActionClick}>
      <div className="action-icon" />
      <div>{data.name}</div>
    </div>
  );
};

ActionSelectOption.propTypes = {
  data: PropTypes.object,
};

ActionSelectOption.defaultProps = {
  data: {},
};

export default React.memo(ActionSelectOption);
