import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const CustomTooltip = (label) => {
  const Tooltip = ({ active, payload: [data] }) => (
    <If condition={active}>
      <div className="custom-tooltip">
        <div className="label">
          {`${moment(data.payload.entryDate).format('YYYY-MM-DD')} - `}
          {moment(data.payload.entryDate).format('dddd')}
        </div>
        <div className="intro">{label} {data.value}</div>
      </div>
    </If>
  );

  Tooltip.propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.array.isRequired,
  };
};

export default CustomTooltip;
