import React from 'react';
import CustomTooltip from '../../../../../components/Chart/CustomTooltip';

export const chartConfig = data => ({
  type: 'lineChart',
  className: 'chart',
  width: '104%',
  height: 200,
  data,
  yAxis: { minTickGap: 40, axisLine: false },
  cartesianGrid: { stroke: '#eee', horizontal: false },
  tooltip: { content: CustomTooltip },
  lines: [{
    type: 'monotone',
    dataKey: 'entries',
    stroke: '#c51d98',
  }],
});

export const chartFooter = total => (
  <div className="chart-footer">
    <div className="chart-footer__total">
      <div>Total Registered</div>
      <div>{total}</div>
    </div>
  </div>
);
