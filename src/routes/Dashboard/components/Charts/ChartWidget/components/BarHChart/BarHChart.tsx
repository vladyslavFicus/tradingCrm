import React from 'react';
import { ResponsiveContainer, CartesianGrid, BarChart, Bar, YAxis, Tooltip, XAxis } from 'recharts';
import { Chart } from '../../types';
import { dateAxisFormatter } from '../../utils';

const BarHChart = (props: Chart) => {
  const { data, chartColor, renderTooltip } = props;

  return (
    <ResponsiveContainer className="ChartDiagram">
      <BarChart
        data={data}
        layout="vertical"
      >
        <XAxis
          type="number"
          stroke="var(--text-tertiary)"
          allowDecimals={false}
        />

        <YAxis
          type="category"
          stroke="var(--text-tertiary)"
          dataKey="entryDate"
          tickFormatter={dateAxisFormatter}
        />

        <Tooltip
          cursor={{ fill: chartColor, fillOpacity: 0.05 }}
          content={renderTooltip}
        />

        <CartesianGrid
          strokeDasharray="3 6"
          stroke="var(--text-tertiary)"
          horizontal={false}
        />

        <Bar
          dataKey="entryValue"
          fill={chartColor}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarHChart);
