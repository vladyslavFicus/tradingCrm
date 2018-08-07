import React from 'react';
import PropTypes from 'prop-types';

const CustomTooltip = ({ active, payload }) => (
  <If condition={active}>
    <div className="custom-tooltip">
      <Choose>
        <When condition={Number(payload[0].payload.name) || Number(payload[0].payload.name) === 0}>
          <div className="label">
            {`${payload[0].payload.name}:00 - ${Number(payload[0].payload.name) + 1}:00`}
          </div>
        </When>
        <Otherwise>
          <div className="label">
            {payload[0].payload.name}
          </div>
        </Otherwise>
      </Choose>
      <div className="intro">Registered Users: {payload[0].value}</div>
    </div>
  </If>
);

CustomTooltip.propTypes = {
  active: PropTypes.bool.isRequired,
  payload: PropTypes.object.isRequired,
};

export default CustomTooltip;
