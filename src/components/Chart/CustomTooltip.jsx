import React from 'react';
import moment from 'moment';

const CustomTooltip = label => ({ active, payload: [data] }) => (
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

export default CustomTooltip;
